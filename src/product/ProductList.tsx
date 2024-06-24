import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import './ProductList.css';

interface Product {
    id: number;
    title: string;
    price: number;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get<Product[]>(`${process.env.REACT_APP_BACKEND_URL}/api/products`);
            setProducts(response.data);
        } catch (error) {
            console.error("There was an error fetching the products!", error);
        }
    };

    const formik = useFormik({
        initialValues: {
            title: '',
            price: 0,
        },
        validationSchema: Yup.object({
            title: Yup.string()
                .required('Title is mandatory')
                .min(5, 'Title must be between 5 and 25 characters')
                .max(25, 'Title must be between 5 and 25 characters'),
            price: Yup.number()
                .required('Price is mandatory')
                .positive('Price must be a positive number'),
        }),
        onSubmit: async (values, { resetForm }) => {
            const newProduct = {
                title: values.title,
                price: values.price,
            };

            try {
                const response = await axios.post<Product[]>(`${process.env.REACT_APP_BACKEND_URL}/api/products`, newProduct);
                setProducts(response.data);
                resetForm();
            } catch (error: any) {
                if (axios.isAxiosError(error)) {
                    console.error("There was an error adding the product!", {
                        message: error.message,
                        code: error.code,
                    });
                } else {
                    console.error("An unexpected error occurred!", error);
                }
            }
        },
    });

    const handleDeleteProduct = async (id: number) => {
        try {
            const response = await axios.delete<Product[]>(`${process.env.REACT_APP_BACKEND_URL}/api/products/${id}`);
            setProducts(response.data);
        } catch (error) {
            console.error("There was an error deleting the product!", error);
        }
    };

    return (
        <div className="product-list-container">
            <h1>Product List</h1>

            <form onSubmit={formik.handleSubmit} className="add-product-form">
                <div>
                    <input
                        type="text" name="title" value={formik.values.title} placeholder="Product Title"
                        onChange={formik.handleChange} onBlur={formik.handleBlur} />

                    {formik.touched.title && formik.errors.title ? (<div className="error">{formik.errors.title}</div>) : null}
                </div>

                <div>
                    <input type="number" name="price" value={formik.values.price} placeholder="Product Price"
                           onChange={formik.handleChange} onBlur={formik.handleBlur} />

                    {formik.touched.price && formik.errors.price ? (<div className="error">{formik.errors.price}</div>) : null}
                </div>

                <button type="submit">Add Product</button>
            </form>

            <table className="product-table">
                <thead>
                <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product) => (
                    <tr key={product.id}>
                        <td>{product.title}</td>
                        <td>${product.price.toFixed(2)}</td>
                        <td>
                            <button className="delete-btn" onClick={() => handleDeleteProduct(product.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
