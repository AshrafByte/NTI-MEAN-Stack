export interface UserInterface {
  id: number | string;
  name: string;
  email: string;
  role: 'user' | 'seller';
  avatar?: string;
  initials?: string;
  sellerInfo?: {
    storeName?: string;
    storeDescription?: string;
    isVerifiedSeller?: boolean;
  };
}
