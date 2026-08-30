import { ProductRepository } from "../../repositories/product.repository";
import { Product, ProductKitItem } from "../../types";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit } from "firebase/firestore";

export class ProductFirebaseProvider implements ProductRepository {
  async getActiveProducts(): Promise<Product[]> {
    const productsRef = collection(db, "products");
    const q = query(productsRef, where("is_active", "==", true));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }

  async getFeaturedProducts(limitCount: number = 4): Promise<Product[]> {
    const productsRef = collection(db, "products");
    const q = query(
      productsRef,
      where("is_active", "==", true),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Product[];
  }

  async getProductById(id: string): Promise<Product | null> {
    const docRef = doc(db, "products", id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      return null;
    }
  }

  async getKitItems(productId: string): Promise<ProductKitItem[]> {
    const itemsRef = collection(db, "product_kit_items");
    const q = query(
      itemsRef,
      where("product_id", "==", productId),
      orderBy("sort_order", "asc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as ProductKitItem[];
  }
}
