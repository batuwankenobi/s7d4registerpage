import { useState } from 'react';
import { FormGroup, Input, Label, Button, Card, CardBody } from 'reactstrap';

const initialValues = {
  ad: "",
  soyad: "",
  email: "",
  password: "",
};

const errorMessages = {
  ad: "Adınızı en az 3 karakter giriniz.",
  soyad: "Soyadınızı en az 3 karakter giriniz.",
  email: "Geçerli bir eposta adresi giriniz.",
  password: "En az 8 karakter, en az 1 büyük harf, en az 1 küçük harf ve en az 1 sembol içermelidir.",
};

const Register = () => {
  const [formData, setFormData] = useState(initialValues);
  const [errors, setErrors] = useState({
    ad: false,
    soyad: false,
    email: false,
    password: false,
  });
  const [userId, setUserId] = useState(null);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });

    // Ad ve Soyad validasyonu
    if (name === "ad" || name === "soyad") {
      setErrors({ ...errors, [name]: value.trim().length < 3 });
    }

    // Email validasyonu
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors({ ...errors, email: !emailRegex.test(value) });
    }

    // Password validasyonu
    if (name === "password") {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setErrors({ ...errors, password: !passwordRegex.test(value) });
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Tüm validasyonları kontrol et
    const hasErrors = Object.values(errors).some((error) => error);
    if (hasErrors) {
      console.error("Form validation failed:", errors);
      return;
    }

    try {
      const response = await fetch("https://reqres.in/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      setUserId(data.id); // User ID'yi al
      setFormData(initialValues); // Formu temizle
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Card>
      <CardBody>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="ad">Ad</Label>
            <Input
              id="ad"
              name="ad"
              placeholder="Adınızı giriniz"
              type="text"
              onChange={handleChange}
              value={formData.ad}
            />
            {errors.ad && <p className="text-danger">{errorMessages.ad}</p>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="soyad">Soyad</Label>
            <Input
              id="soyad"
              name="soyad"
              placeholder="Soyadınızı giriniz"
              type="text"
              onChange={handleChange}
              value={formData.soyad}
            />
            {errors.soyad && <p className="text-danger">{errorMessages.soyad}</p>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="Email adresinizi giriniz."
              type="email"
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && <p className="text-danger">{errorMessages.email}</p>}
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="Güçlü bir şifre seçiniz"
              type="password"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && <p className="text-danger">{errorMessages.password}</p>}
          </FormGroup>
          <Button color="primary" type="submit" disabled={Object.values(errors).some((error) => error)}>
            Kayıt Ol
          </Button>
        </form>

        {userId && <p>Kullanıcı ID: {userId}</p>}
      </CardBody>
    </Card>
  );
};

export default Register;
