import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, ArrowLeft, User } from 'lucide-react';
import logoIcon from '../../assets/logo2.png';
import './Header.css';

interface HeaderProps {
    variant?: 'home' | 'detail';
    onAddClick?: () => void;
}

function Header({ variant = 'home', onAddClick }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="header">
            <Link to="/" className="header-logo">
                <img src={logoIcon} alt="" className="header-logo-icon" />
                <div className="header-logo-text">
                    cinelog
                    <span>seu diário de filmes</span>
                </div>
            </Link>

            {variant === 'home' ? (
                <>
                    <div className="header-search">
                        <Search size={16} strokeWidth={2} />
                        <input type="text" placeholder="Buscar por título, gênero..." />
                    </div>

                    <div className="header-actions">
                        <button className="header-btn-add" onClick={onAddClick}>
                            <Plus size={16} strokeWidth={2.5} />
                            Adicionar filme
                        </button>
                        <div className="header-avatar" title="Perfil do usuário">
                            <User size={18} strokeWidth={2} />
                        </div>
                    </div>
                </>
            ) : (
                <button className="header-back" onClick={() => navigate(-1)}>
                    <ArrowLeft size={14} strokeWidth={2} />
                    Voltar
                </button>
            )}
        </header>
    );
}

export default Header;