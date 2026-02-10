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
    <div
      style={{
        display: 'flex',
        justifyContent: 'end',
      }}
    >
      <Button onClick={handleLogout} variant="destructive">
        Logout
      </Button>
    </div>
  );
}
