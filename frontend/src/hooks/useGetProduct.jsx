import { useEffect, useState } from "react";
import { getProductById, getProductsComments, getProductsReviews } from "../services/ApiService";

export default function useGetProduct(productId) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    const product = await getProductById(productId);
    if(!product) {
      setProduct(null);
      setLoading(false);
      return;
    }
    const commentaries = await getProductsComments(productId);
    const reviews = await getProductsReviews(productId);
    product.commentaries = commentaries;
    product.reviews = reviews;
    setProduct(product);
    setLoading(false);
  }

  const refresh = async () => {
    setLoading(true);
    fetchProduct();
  }

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  return { product, loading, refresh };
}