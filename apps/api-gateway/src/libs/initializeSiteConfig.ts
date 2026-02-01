import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

const initializeSiteConfig = async () => {
    try {
        const existingConfig = await prisma.site_config.findFirst();
        if (!existingConfig) await prisma.site_config.create({
            data: {
                categories: [
                    "Electronics",
                    "Fashion",
                    "Home and Kitchen",
                    "Sports and Fitness",
                ],
                subCategories: {
                    "Electronics": ["Mobiles", "Laptops", "Computers", "Accessories"],
                    "Fashion": ["Men", "Women", "Kids", "Footwear"],
                    "Sports and Fitness": ["Gym Equipment", "Outdoor Sports", "Wearables"],
                }
            }
        })
    } catch (error) {
        console.error("Error while initializing site config:\n", error);
    }
}

export default initializeSiteConfig;