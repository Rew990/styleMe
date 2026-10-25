import { useState } from 'react';
import { signUp } from './repository';
import { AuthErrors, validateSignUp } from './validation';
import { User } from '../../models/User';

export function useSignUpViewModel(onSignedUp: (user: User) => void) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<AuthErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

async function submit() {
    const found = validateSignUp(name, email, password, confirm);
    setErrors(found);
    setFormError(null);
    if (Object.keys(found).length > 0) return;
    setLoading(true);
    try {
        onSignedUp(await signUp(name, email, password));
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return { name, setName, email, setEmail, password, setPassword, confirm, setConfirm, errors, formError, loading, submit };
}