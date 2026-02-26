import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function Logout() {
  const navigate = useNavigate();
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login/');
  };
  return (
    <div className="flex justify-end">
      <Button onClick={handleLogout} variant="destructive" size="sm">
        Logout
      </Button>
    </div>
  );
}
