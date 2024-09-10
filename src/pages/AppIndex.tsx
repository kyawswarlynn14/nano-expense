import { useData } from '@/App';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AppIndex = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { setIsLogin } = useData();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.password.length < 6) {
        toast({variant: "destructive", description: "Invalid Password!"})
        return
    }
    if(formData.email === "dc@gmail.com" && formData.password === "123456") {
        setIsLogin(true);
        navigate('/income', {replace: true});
    } else {
        toast({variant: "destructive", description: "Invalid Email or Password!"})
    }
  };

  return (
    <div className='w-full min-h-screen flex items-center justify-center'>
        <Card className="w-full max-w-md mx-auto">
        <CardHeader>
            <CardTitle className='text-center font-bold text-xl'>Login</CardTitle>
        </CardHeader>
        <CardContent>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <Label htmlFor="email">Email</Label>
                <Input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="mt-2"
                required
                />
            </div>
            <div className="mb-4">
                <Label htmlFor="password">Password</Label>
                <Input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="mt-2"
                required
                />
            </div>
            <Button type="submit" className="w-full">
                Login
            </Button>
            </form>
        </CardContent>
        </Card>
    </div>
  );
};

export default AppIndex;
