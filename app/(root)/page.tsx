import Link from "next/link";

export default async function Login() {  

  return (
    <div className="landing-page-container">
      <div className="header">
        <h1 className="title">SIGPRO</h1>
        <p className="subtitle">Sistema de Gestión de Proyectos</p>
      </div>

      <div className="content">
        <h2 className="content-title">Bienvenido</h2>
        <p className="content-description">
          Optimiza el proceso de gestión de solicitudes y convierte las mejores ideas en proyectosestratégicos.
        </p>
        <Link className="login-button" href="/login">Iniciar Sesión</Link>        
      </div>

      <div className="footer">
        <p className="footer-text">© 2025 ONPE | All rights reserved.</p>
      </div>
    </div>   
  );
}
