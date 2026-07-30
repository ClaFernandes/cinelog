import { Link } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import './NotFoundPage.css';

function NotFoundPage() {
    return (
        <div className="not-found-wrapper">
            <Header variant="detail" />
            <div className="not-found">
                <Clapperboard size={48} strokeWidth={1.5} className="not-found-icon" />
                <h1 className="not-found-code">404</h1>
                <p className="not-found-message">
                    Essa cena não existe no seu diário de filmes.
                </p>
                <Link to="/" className="not-found-link">
                    Voltar para a Home
                </Link>
            </div>
            <Footer />
        </div>
    );
}

export default NotFoundPage;