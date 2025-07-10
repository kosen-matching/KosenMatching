import { Testimonial } from "@/types/testimonial"

// This matches the Review interface from the reviews page
interface Review {
  _id: string;
  kosenId: string;
  username: string;
  profileImageUrl?: string;
  year: number;
  department: string;
  title: string;
  content: string;
  rating: number;
  createdAt: string;
}

// This function now fetches real data and transforms it.
export async function getTopTestimonials(): Promise<Testimonial[]> {
  try {
    // In a server component/function, we can use an absolute URL for fetch
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/reviews`, {
      // Use cache-busting to get fresh data, important for likes
      next: { revalidate: 0 } 
    });

    if (!res.ok) {
      console.error("Failed to fetch reviews:", res.statusText);
      return [];
    }

    const reviewsResponse = await res.json();
    const reviews: Review[] = reviewsResponse.data || [];

    // Transform Review[] to Testimonial[]
    const testimonials: Testimonial[] = reviews.map(review => ({
      id: review._id,
      name: review.username,
      // For now, role is a combination of department and year
      role: `${review.department}科 / ${review.year}年入学`,
      title: review.title,
      // We'll use the main content as the comment for the landing page
      comment: review.content, 
      avatar: review.profileImageUrl || '/placeholder-user.jpg',
      // The 'likeCount' is not in the Review model yet. Defaulting to 0.
      // TODO: Add likeCount to the review data model and API.
      likeCount: 0 
    }));

    // TODO: The sorting should happen based on the real likeCount from the DB.
    // For now, this sorting does nothing as all likeCounts are 0.
    const sorted = testimonials.sort((a, b) => b.likeCount - a.likeCount);
    
    return sorted.slice(0, 3);

  } catch (error) {
    console.error("Error fetching top testimonials:", error);
    return [];
  }
} 