import React, { useState } from "react";
import { useFirebase } from "../../../utils/FirebaseContext";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useFirebase();

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();
    // await signUp(email, password);
  };

  if (user) {
    return <p>Welcome, {user.email}</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUp;