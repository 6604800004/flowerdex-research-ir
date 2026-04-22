import { useLocation, Link, useNavigate } from "react-router-dom";
import { LogOut, Loader2 } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  const handleSignOut = async () => {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    navigate("/");
  };

  const publicLinks = [
    { to: "/", label: "หน้าหลัก" },
    { to: "/favorites", label: "รายการโปรด" },
  ];

  return (
    <nav className="bg-card border-b border-border px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌼</span>
        <div>
          <h1 className="font-kanit font-bold text-lg text-foreground tracking-wide">
            FLOWER DEX
          </h1>
          <p className="font-sarabun text-xs text-muted-foreground -mt-1">
            ระบบค้นข้อมูลดอกไม้
          </p>
        </div>
      </div>

      {/* Links */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {publicLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`font-kanit px-3 sm:px-5 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === link.to
                ? "bg-primary text-primary-foreground"
                : "border border-border text-foreground hover:bg-muted"
            }`}
          >
            {link.label}
          </Link>
        ))}

        {/* Admin link — แสดงเฉพาะเมื่อ login */}
        {user ? (
          <>
            <Link
              to="/admin"
              className={`font-kanit px-3 sm:px-5 py-2 rounded-lg text-sm transition-colors ${
                location.pathname === "/admin"
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-foreground hover:bg-muted"
              }`}
            >
              จัดการ
            </Link>

            {/* User badge + logout */}
            <div className="flex items-center gap-1.5 ml-1 pl-2 border-l border-border">
              <span
                className="hidden sm:block font-sarabun text-xs text-muted-foreground max-w-[120px] truncate"
                title={user.email}
              >
                {user.email}
              </span>
              <button
                onClick={handleSignOut}
                disabled={signingOut}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg border border-border text-sm text-foreground hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive transition-colors disabled:opacity-50"
                title="ออกจากระบบ"
              >
                {signingOut ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <LogOut size={14} />
                )}
                <span className="font-kanit text-xs hidden sm:inline">
                  ออกจากระบบ
                </span>
              </button>
            </div>
          </>
        ) : (
          // แสดงปุ่ม Login ที่มุมขวาเสมอ (สำหรับ admin)
          <Link
            to="/login"
            className={`font-kanit px-3 sm:px-5 py-2 rounded-lg text-sm transition-colors border border-border text-foreground hover:bg-muted ${
              location.pathname === "/login"
                ? "bg-primary text-primary-foreground border-primary"
                : ""
            }`}
          >
            เข้าสู่ระบบ
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
