import React, { useState } from "react";
import "./Add.css";
import { assets, url } from "../../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const resizeImage = async (file, width = 920, height = 1080) => {
	return new Promise((resolve, reject) => {
		const img = new window.Image();
		img.onload = () => {
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);
			canvas.toBlob(
				(blob) => {
					if (blob) resolve(blob);
					else reject(new Error("Canvas is empty"));
				},
				file.type || "image/jpeg",
				0.95
			);
		};
		img.onerror = reject;
		img.src = URL.createObjectURL(file);
	});
};

const Add = () => {
	const [image, setImage] = useState(false);
	const [data, setData] = useState({
		name: "",
		description: "",
		price: "",
		category: "Scarves",
	});

	const onSubmitHandler = async (event) => {
		event.preventDefault();

		if (!image) {
			toast.error("Image not selected");
			return null;
		}

		let resizedImage;
		try {
			resizedImage = await resizeImage(image, 920, 1080);
		} catch (err) {
			toast.error("Failed to resize image");
			return null;
		}

		const formData = new FormData();
		formData.append("name", data.name);
		formData.append("description", data.description);
		formData.append("price", Number(data.price));
		formData.append("category", data.category);
		formData.append("image", resizedImage, image.name || "image.jpg");
		const response = await axios.post(`${url}/api/food/add`, formData);
		if (response.data.success) {
			toast.success(response.data.message);
			setData({
				name: "",
				description: "",
				price: "",
				category: data.category,
			});
			setImage(false);
		} else {
			toast.error(response.data.message);
		}
	};

	const onChangeHandler = (event) => {
		const name = event.target.name;
		const value = event.target.value;
		setData((data) => ({ ...data, [name]: value }));
	};

	return (
		<div className="add">
			<form
				className="flex-col"
				onSubmit={onSubmitHandler}>
				<div className="add-img-upload flex-col">
					<p>Upload image</p>
					<input
						onChange={(e) => {
							setImage(e.target.files[0]);
							e.target.value = "";
						}}
						type="file"
						accept="image/*"
						id="image"
						hidden
					/>
					<label htmlFor="image">
						<img
							src={!image ? assets.upload_area : URL.createObjectURL(image)}
							alt=""
						/>
					</label>
				</div>
				<div className="add-product-name flex-col">
					<p>Product name</p>
					<input
						name="name"
						onChange={onChangeHandler}
						value={data.name}
						type="text"
						placeholder="Type here"
						required
					/>
				</div>
				<div className="add-product-description flex-col">
					<p>Product description</p>
					<textarea
						name="description"
						onChange={onChangeHandler}
						value={data.description}
						type="text"
						rows={6}
						placeholder="Write content here"
						required
					/>
				</div>
				<div className="add-category-price">
					<div className="add-category flex-col">
						<p>Product category</p>
						<select
							name="category"
							onChange={onChangeHandler}>
							<option value="Scarves">Scarves</option>
							<option value="Sweaters">Sweaters</option>
							<option value="Beanies & Hats">Beanies & Hats</option>
							<option value="Shawls & Wraps">Shawls & Wraps</option>
							<option value="Woolen Dresses">Woolen Dresses</option>
							<option value="Hair Bow">Hair Bow</option>
							<option value="Bikini">Bikini</option>
							<option value="Skirts">Skirts & Vests</option>
							<option value="Vests">Accessories</option>
						</select>
					</div>
					<div className="add-price flex-col">
						<p>Product Price</p>
						<input
							type="Number"
							name="price"
							onChange={onChangeHandler}
							value={data.price}
							placeholder="25"
						/>
					</div>
				</div>
				<button
					type="submit"
					className="add-btn">
					ADD
				</button>
			</form>
		</div>
	);
};

export default Add;
