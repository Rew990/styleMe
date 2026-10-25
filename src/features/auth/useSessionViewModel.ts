import { useEffect, useState } from 'react';
import { getCurrentUser, logOut } from './repository';
import { User } from '../../models/User';

export function useSessionViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .finally(() => setChecking(false));
  }, []);

  async function signOut() {
    await logOut();
    setUser(null);
  }

  return { user, setUser, checking, signOut };
}