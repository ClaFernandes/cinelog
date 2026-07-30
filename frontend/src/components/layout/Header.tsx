import { useNavigate, Link } from 'react-router-dom';
import { Search, Plus, ArrowLeft, User } from 'lucide-react';
import logoIcon from '../../assets/logo2.png';
import './Header.css';

interface HeaderProps {
    variant?: 'home' | 'detail';
    onAddClick?: () => void;
    searchValue?: string;
    onSearchChange?: (value: string) => void;
}

function Header({ variant = 'home', onAddClick, searchValue = '', onSearchChange }: HeaderProps) {
    const navigate = useNavigate();

    return (
        <header className="header">
            <Link to="/" className="header-logo">
                <img src={logoIcon} alt="" className="header-logo-icon" />
                <div className="header-logo-text">
                    cinelog
                    <span>seu diário de filmes e séries</span>
                </div>
            </Link>

            {variant === 'home' ? (
                <>
                    <div className="header-search">
                        <Search size={16} strokeWidth={2} />
                        <input
                            type="text"
                            placeholder="Buscar por título, gênero..."
                            value={searchValue}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                    </div>

                    <div className="header-actions">
                        <button className="header-btn-add" onClick={onAddClick}>
                            <Plus size={16} strokeWidth={2.5} />
                            Adicionar filme ou série
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
