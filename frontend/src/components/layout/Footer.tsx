import { Link } from 'react-router-dom';
import logoImg from '../../assets/logo2.png';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <img src={logoImg} alt="Cinelog Icon" className="footer-logo-img" />
                <span>© 2026 Cinelog — seu diário de filmes</span>
            </div>

            <div className="footer-links">
                <Link to="/sobre">Sobre</Link>
                <a href="https://github.com/ClaFernandes/cinelog" target="_blank" rel="noopener noreferrer">
                    GitHub
                </a>
                <a href="https://www.linkedin.com/in/claricefernandes/" target="_blank" rel="noopener noreferrer">
                    LinkedIn
                </a>
                <a href="mailto:clarice_fernandes@hotmail.com">Contato</a>
            </div>

            <div className="footer-tmdb-credit">
                <span className="footer-tmdb-badge">TMDB</span>
                <span>Dados de filmes fornecidos por The Movie Database</span>
            </div>
        </footer>
    );
}

export default Footer;