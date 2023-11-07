import { useRouter } from 'next/router';

const PrivateWrapper = ({ children, isLoggedIn, authToken }) => {
    const router = useRouter();
  
    if (isLoggedIn && authToken) {
      return <>{children}</>;
    } else {
      router.replace('/login');
      return null;
    }
  };
  
  export default PrivateWrapper;
  