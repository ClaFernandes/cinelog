import logoImg from '../../assets/logo2.png';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <img src={logoImg} alt="Cinelog Icon" className="footer-logo-img" />
                <span>© 2026 Cinelog — diário pessoal de filmes</span>
            </div>

            <div className="footer-links">
                <span>Sobre</span>
                <span>GitHub</span>
                <span>Contato</span>
            </div>

            {/* Crédito ao TMDB */}
            <div className="footer-tmdb-credit">
                <span className="footer-tmdb-badge">TMDB</span>
                <span>Dados de filmes fornecidos por The Movie Database</span>
            </div>
        </footer>
    );
}

export default Footer;