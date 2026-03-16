import {
  AuthError,
  NotFoundError,
  ValidationError,
} from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import { Request, NextFunction, Response } from "express";
import imagekit from "@packages/libs/imagekit";
import axiosInstance from "../utils/axiosInstance";
import { Prisma } from "generated/prisma/client";

// Categories
export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const config = await prisma.site_config.findFirst();
    if (!config)
      return res.status(404).json({ message: "Categories not found." });

    return res.status(200).json({
      categories: config.categories,
      subCategories: config.subCategories,
    });
  } catch (error) {
    return next(error);
  }
};

// Discount
export const createDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { public_name, discountType, discountValue, discountCode } = req.body;

    const isDiscountCodeExist = await prisma.discount_codes.findUnique({
      where: { discountCode },
    });

    if (isDiscountCodeExist)
      return next(
        new ValidationError(
          "Discount code already available. Please use a different code.",
        ),
      );

    const discount_code = await prisma.discount_codes.create({
      data: {
        public_name,
        discountType,
        discountValue: parseFloat(discountValue),
        discountCode,
        sellerId: req.seller.id,
      },
    });

    res.status(201).json({
      success: true,
      discount_code,
    });
  } catch (error) {
    next(error);
  }
};

export const getDiscountCodes = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const discount_codes = await prisma.discount_codes.findMany({
      where: { sellerId: req.seller.id },
    });

    res.status(201).json({
      success: true,
      discount_codes,
    });
  } catch (error) {
    return next(error);
  }
};

export const deleteDiscountCode = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const sellerId = req.seller?.id;

    const discountCode = await prisma.discount_codes.findUnique({
      where: { id },
      select: { id: true, sellerId: true },
    });
    if (!discountCode)
      return next(new NotFoundError("Discount code not found!"));
    if (discountCode.sellerId !== sellerId)
      return next(new ValidationError("Unauthorized access!"));

    await prisma.discount_codes.delete({ where: { id } });

    return res.status(200).json({
      message: "Discount code successfully deleted",
    });
  } catch (error) {
    next(error);
  }
};

// Imagekit
export const uploadProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { base64File } = req.body;

    if (!base64File) {
      return res.status(400).json({
        message: "No file provided",
      });
    }

    const uploadImage = await imagekit.files.upload({
      file: base64File,
      fileName: `product-${Date.now()}.jpg`,
    });

    return res.json({
      file_url: uploadImage.url,
      fileId: uploadImage.fileId,
    });
  } catch (error) {
    console.log("Imagekit upload error", error);
    return next(error);
  }
};

export const deleteProductImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { fileId } = req.body;

    await axiosInstance.delete(`https://api.imagekit.io/v1/files/${fileId}`, {
      headers: {
        Accept: "application/json",
        Authorization: `Basic ${Buffer.from(process.env.IMAGEKIT_PRIVATE_KEY + ":").toString("base64")}`,
      },
    });

    res.status(200).json({
      success: true,
      message: "Successfully deleted the file",
    });
  } catch (error) {
    next(error);
  }
};

// Product
export const createProduct = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const {
      title,
      short_description,
      detailed_description,
      warranty,
      custom_specification,
      slug,
      tags,
      cash_on_delivery,
      brand,
      video_url,
      category,
      colors = [],
      sizes = [],
      discountCodes,
      stock,
      sale_price,
      regular_price,
      subCategory,
      customProperties = {},
      images = [],
    } = req.body;

    if (
      !title ||
      !slug ||
      !short_description ||
      !category ||
      !subCategory ||
      !sale_price ||
      !tags ||
      !images ||
      !stock ||
      !regular_price
    )
      return next(new ValidationError("Missing required fields"));
    if (!req.seller.id)
      return next(new AuthError("Only registered seller can create products"));

    const newProduct = await prisma.products.create({
      data: {
        title,
        slug,
        category,
        subCategory,
        short_description,
        detailed_description,
        images: {
          create: images
            .filter((image: any) => image && image.fileId && image.file_url)
            .map((image: any) => ({
              fileId: image.fileId,
              url: image.file_url,
            })),
        },
        video_url,
        tags: Array.isArray(tags) ? tags : tags.split(","),
        brand,
        colors,
        sizes: sizes || [],
        stock: parseInt(stock),
        sale_price: parseFloat(sale_price),
        regular_price: parseFloat(regular_price),
        warranty,
        custom_specification: custom_specification || {},
        custom_properties: customProperties || {},
        cashOnDelivery: cash_on_delivery,
        discount_codes: discountCodes.map((codeId: string) => codeId),
        shopId: req.seller?.shop?.id!,
      },
      include: { images: true },
    });

    res.status(201).json({
      message: "Successfully created product",
      success: true,
      newProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const getShopProducts = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        shopId: req?.seller?.shop?.id,
      },
      include: {
        images: true,
      },
    });

    res.status(201).json({
      success: true,
      products,
    });
  } catch (error) { }
};

export const deleteProduct = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
        shopId: true,
        isDeleted: true,
      },
    });

    if (!product) return next(new ValidationError("Product not found"));
    if (product.shopId !== sellerId)
      return next(new AuthError("Unauthorized action"));
    if (product.isDeleted)
      return next(new ValidationError("Product is already deleted"));

    const deleteProduct = await prisma.products.update({
      where: { id: productId },
      data: {
        isDeleted: true,
        deletedAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });

    return res.status(200).json({
      message:
        "Product is scheduled for deletion in 24 hours. You can restore it within this time",
      deleteAt: deleteProduct.deletedAt,
    });
  } catch (error) {
    return next(error);
  }
};

export const restoreProduct = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { productId } = req.params;
    const sellerId = req.seller?.shop?.id;

    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: {
        id: true,
        shopId: true,
        isDeleted: true,
      },
    });

    if (!product) return next(new ValidationError("Product not found"));
    if (product.shopId !== sellerId)
      return next(new AuthError("Unauthorized action"));
    if (!product.isDeleted) {
      res.status(400).json({
        message: "Product is not in deleted state",
      });
    }

    await prisma.products.update({
      where: {
        id: productId,
      },
      data: {
        isDeleted: false,
        deletedAt: null,
      },
    });

    res.status(200).json({
      message: "Product successfully restored!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while restoring the product",
      error,
    });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;
    const type = req.query.type;

    const baseFilter: Prisma.productsWhereInput = {
      OR: [
        {
          // starting_date: null
          starting_date: { isSet: false },
        },
        {
          // ending_date: null
          ending_date: { isSet: false },
        }
      ]
    };

    const orderBy: Prisma.productsOrderByWithRelationInput =
      type === "latest"
        ? { createdAt: "desc" }
        : { totalSales: "desc" };
    const [products, total, top10Products] = await Promise.all([
      prisma.products.findMany({
        skip, take: limit, include: {
          images: true,
          Shop: true,
        }, where: baseFilter,
        orderBy: {
          totalSales: "desc"
        }
      }),
      prisma.products.count({
        where: baseFilter
      }),
      prisma.products.findMany({
        take: 10,
        where: baseFilter,
        orderBy,
      })
    ]);

    res.status(200).json({
      products,
      top10By: type === "latest" ? "latest" : "topSales",
      top10Products,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    next(error);
  }
};

export const getProductDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await prisma.products.findUnique({
      where: {
        slug: req.params.slug!,
      },
      include: {
        images: true,
        Shop: true,
      }
    });

    res.status(201).json({
      success: true,
      product,
    })
  } catch (error) {
    return next(error);
  }
};

export const getFilteredProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      priceRange = [0, 10000],
      categories = [],
      colors = [],
      sizes = [],
      page = 1,
      limit = 12
    } = req.body;
    const parsedPriceRange = typeof priceRange === "string" ? priceRange.split(",").map(Number) : [0, 10000];
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const filters: Record<string, any> = {
      sale_price: {
        gte: parsedPriceRange[0],
        lte: parsedPriceRange[1],
      },
      starting_date: null,
    };

    if (categories && (categories as string[]).length > 0) {
      filters.category = {
        in: Array.isArray(categories) ? categories : String(categories).split(",")
      }
    };

    if (colors && (colors as string[]).length > 0) {
      filters.colors = {
        hasSome: Array.isArray(colors) ? colors : [colors]
      }
    };

    if (sizes && (sizes as string[]).length > 0) {
      filters.sizes = {
        hasSome: Array.isArray(sizes) ? sizes : [sizes],
      }
    };

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        include: {
          images: true,
          Shop: true,
        }
      }),
      prisma.products.count({ where: filters })
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    res.json({
      products,
      pagination: {
        total,
        page: parsedPage,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getFilteredEvents = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      priceRange = [0, 10000],
      categories = [], colors = [],
      sizes = [],
      page = 1,
      limit = 12
    } = req.body;

    const parsedPriceRange = typeof priceRange === "string" ? priceRange.split(",").map(Number) : [0, 10000];
    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const filters: Record<string, any> = {
      sale_price: {
        gte: parsedPriceRange[0],
        lte: parsedPriceRange[1],
      },
      NOT: {
        starting_date: null,
      },
    };

    if (categories && (categories as string[]).length > 0) {
      filters.category = {
        in: Array.isArray(categories) ? categories : String(categories).split(",")
      }
    };

    if (colors && (colors as string[]).length > 0) {
      filters.colors = {
        hasSome: Array.isArray(colors) ? colors : [colors]
      }
    };

    if (sizes && (sizes as string[]).length > 0) {
      filters.sizes = {
        hasSome: Array.isArray(sizes) ? sizes : [sizes],
      }
    };

    const [products, total] = await Promise.all([
      prisma.products.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        include: {
          images: true,
          Shop: true,
        }
      }),
      prisma.products.count({ where: filters })
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    res.json({
      products,
      pagination: {
        total,
        page: parsedPage,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const getFilteredShops = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      categories = [],
      countries = [],
      page = 1,
      limit = 12,
    } = req.query;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);
    const skip = (parsedPage - 1) * parsedLimit;

    const filters: Record<string, any> = {};

    if (categories && (categories as string[]).length > 0) {
      filters.category = {
        in: Array.isArray(categories) ? categories : String(categories).split(",")
      }
    };

    if (countries && String(countries).length > 0) {
      filters.country = {
        in: Array.isArray(countries) ? countries : String(countries).split(","),
      };
    }

    const [shops, total] = await Promise.all([
      prisma.shops.findMany({
        where: filters,
        skip,
        take: parsedLimit,
        include: {
          sellers: true,
          // followers: true,
          products: true,
        }
      }),
      prisma.shops.count({ where: filters })
    ]);

    const totalPages = Math.ceil(total / parsedLimit);

    res.json({
      shops,
      pagination: {
        total,
        page: parsedPage,
        totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
}

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = req.query.q as string;
    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: "Search query is required." })
    }

    const products = await prisma.products.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
              mode: "insensitive",
            }
          },
          {
            short_description: {
              contains: query,
              mode: "insensitive",
            }
          }
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
      take: 10,
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.status(200).json({products});
  } catch (error) {
    return next(error);
  }
}