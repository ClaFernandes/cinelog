import './ConfirmDialog.css';

interface ConfirmDialogProps {
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
}

function ConfirmDialog({ title, message, confirmLabel = 'Confirmar', onConfirm, onCancel }: ConfirmDialogProps) {
    return (
        <div className="confirm-dialog-overlay" onClick={onCancel}>
            <div className="confirm-dialog-modal" onClick={(e) => e.stopPropagation()}>
                <h3 className="confirm-dialog-title">{title}</h3>
                <p className="confirm-dialog-message">{message}</p>
                <div className="confirm-dialog-actions">
                    <button className="confirm-dialog-cancel-btn" onClick={onCancel}>
                        Cancelar
                    </button>
                    <button className="confirm-dialog-confirm-btn" onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmDialog;