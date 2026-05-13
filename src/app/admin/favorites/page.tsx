import { prisma } from "@/lib/prisma";
import FavoritesClient from "./FavoritesClient";

export default async function AdminFavoritesPage() {
  const favorites = await prisma.favorite.findMany({
    include: {
      user: {
        select: { name: true, email: true, image: true }
      },
      lesson: {
        select: { 
          title: true, 
          slug: true, 
          videoUrl: true,
          subject: { select: { name: true } } 
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return <FavoritesClient favorites={favorites} />;
}
