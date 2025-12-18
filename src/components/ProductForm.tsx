import React, { useState, useRef, useEffect } from 'react';
import { db, type Product } from '../db/db';
import { Upload, X } from 'lucide-react';
import './ProductForm.css';

interface ProductFormProps {
    product?: Product; // If provided, we are editing
    onSave: () => void;
    onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSave, onCancel }) => {
    const [name, setName] = useState(product?.name || '');
    const [brand, setBrand] = useState(product?.brand || '');
    const [content, setContent] = useState(product?.content || '');
    const [basePrice, setBasePrice] = useState(product?.basePrice.toString() || '');

    const [image, setImage] = useState<string | undefined>(product?.image);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Clean up memory if needed, although Base64 is just a string.
    useEffect(() => {
        return () => {
            // If we were using object URLs, we'd revoke them here.
        };
    }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert("La imagen es muy pesada. Máximo 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setImage(undefined);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) {
            setError('El nombre es obligatorio');
            return;
        }
        const price = parseFloat(basePrice);
        if (isNaN(price) || price < 0) {
            setError('El precio debe ser un número válido');
            return;
        }

        try {
            if (product?.id) {
                // Update
                await db.products.update(product.id, {
                    name,
                    brand,
                    content,
                    basePrice: price,
                    image
                });
            } else {
                // Create
                await db.products.add({
                    name,
                    brand,
                    content,
                    basePrice: price,
                    image
                });
            }
            onSave();
        } catch (err) {
            console.error(err);
            setError('Error al guardar el producto');
        }
    };

    return (
        <form className="product-form card" onSubmit={handleSubmit}>
            <h2>{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>

            {error && <div className="error-msg">{error}</div>}

            {/* Image Upload Section */}
            <div className="form-group image-upload-section">
                <label className="image-preview-label">
                    {image ? (
                        <div className="image-preview-container">
                            <img src={image} alt="Preview" className="image-preview" />
                            <button
                                type="button"
                                className="remove-image-btn"
                                onClick={handleRemoveImage}
                                aria-label="Quitar imagen"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div className="image-placeholder" onClick={() => fileInputRef.current?.click()}>
                            <div className="placeholder-content">
                                <Upload size={24} className="icon-muted" />
                                <span>Subir Foto</span>
                                <span className="text-xs text-muted">(Opcional)</span>
                            </div>
                        </div>
                    )}
                </label>
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                />
            </div>

            <div className="form-group">
                <label>Nombre</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Leche Descremada"
                    autoFocus
                />
            </div>

            <div className="form-row">
                <div className="form-group half">
                    <label>Marca</label>
                    <input
                        type="text"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                        placeholder="Ej: La Serenisima"
                    />
                </div>
                <div className="form-group half">
                    <label>Contenido</label>
                    <input
                        type="text"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Ej: 1L"
                    />
                </div>
            </div>

            <div className="form-group">
                <label>Precio Base ($)</label>
                <input
                    type="number"
                    step="0.01"
                    value={basePrice}
                    onChange={(e) => setBasePrice(e.target.value)}
                    placeholder="0.00"
                />
            </div>



            <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onCancel}>
                    Cancelar
                </button>
                <button type="submit" className="btn-primary">
                    Guardar
                </button>
            </div>
        </form>
    );
};
