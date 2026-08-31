import { TestimonialRepository } from "../../repositories/testimonial.repository";
import { Testimonial } from "../../types";
import { db } from "../../firebase/config";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";

export class TestimonialFirebaseProvider implements TestimonialRepository {
  async getActiveTestimonials(): Promise<Testimonial[]> {
    const testimonialsRef = collection(db, "testimonials");
    const q = query(
      testimonialsRef,
      where("is_active", "==", true),
      orderBy("created_at", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Testimonial[];
  }
}
