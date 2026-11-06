"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TestAuthPage() {
  const [result, setResult] = useState<string>("");
  const [email, setEmail] = useState("nexussafesphere@outlook.com");
  const [password, setPassword] = useState("");

  const testAuth = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        setResult("Auth Error: " + error.message);
      } else {
        setResult("Auth Success: " + data.user?.email);
      }
    } catch (err) {
      setResult("Exception: " + (err instanceof Error ? err.message : "Unknown"));
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Test Auth</h1>
      <div className="space-y-4">
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input w-full"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input w-full"
            placeholder="Enter password"
          />
        </div>
        <button onClick={testAuth} className="btn btn-primary w-full">
          Test Login
        </button>
        <p className="text-sm text-muted">{result}</p>
      </div>
    </div>
  );
}