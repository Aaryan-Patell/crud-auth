import productModel from "../models/product.model.js";


export async function createProduct(req, res) {
    try {
        const { name, price, description } = req.body;

        const product = await productModel.create({
            name,
            price,
            description
        });

        return res.status(201).json({
            message: "Product created successfully",
            product
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}



export async function getProducts(req, res) {
    try {
        const products = await productModel.find();

        return res.status(200).json({
            products
        });

    } catch (error) {
        return res.status(500).json({
            message: "Server error"
        });
    }
}



export async function getProduct(req, res) {
    try {
        const product = await productModel.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            product
        });

    } catch (error) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }
}



export async function updateProduct(req, res) {
    try {
        const { name, price, description } = req.body;

        const product = await productModel.findByIdAndUpdate(
            req.params.id,
            {
                name,
                price,
                description
            },
            {
                new: true
            }
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }
}



export async function deleteProduct(req, res) {
    try {
        const product = await productModel.findByIdAndDelete(
            req.params.id
        );

        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }

        return res.status(200).json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        return res.status(400).json({
            message: "Invalid product ID"
        });
    }
}