import noImage from '@/public/assets/no-image.png';
import { ENV } from '@/utils/config';

export const ImageHandler = (image: string | null) => {
  return image ? `${ENV.API_URL}${image}` : noImage;
};
