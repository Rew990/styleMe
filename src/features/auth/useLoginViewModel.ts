import { useState } from 'react';
import { logIn } from './repository';
import { AuthErrors, validateLogin } from './validation';
import { User } from '../../models/User';

export function useLoginViewModel(onLoggedIn: (user: User) => void) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<AuthErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    const found = validateLogin(email, password);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;
    setLoading(true);
    try {
      onLoggedIn(await logIn(email, password));
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return { email, setEmail, password, setPassword, errors, formError, loading, submit };
}