import {
  AuthError,
  NotFoundError,
  ValidationError,
} from "@packages/error-handler";
import prisma from "@packages/libs/prisma";
import { Request, NextFunction, Response } from "express";
import imagekit from "@packages/libs/imagekit";
import axiosInstance from "../utils/axiosInstance";

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

    console.log(uploadImage);

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

    console.log(images);

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
    })

    res.status(201).json({
      success: true,
      products,
    })
  } catch (error) {
    
  }
};