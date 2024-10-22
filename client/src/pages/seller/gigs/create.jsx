import ImageUpload from "../../../components/ImageUpload";
import { categories } from "../../../utils/categories";
import { ADD_GIG_ROUTE } from "../../../utils/constants";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useCookies } from "react-cookie";

function CreateGigs() {
  const [cookies] = useCookies();
  const router = useRouter();
  const inputClassName =
    "block p-4 w-full text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500";
  const labelClassName = "mb-2 text-lg font-medium text-gray-900";
  const [files, setFile] = useState([]);
  const [features, setfeatures] = useState([]);
  const [data, setData] = useState({
    title: "",
    category: "",
    description: "",
    time: 0,
    revisions: 0,
    feature: "",
    price: 0,
    shortDesc: "",
    timeUnit: "days", // Added to handle the unit for delivery time
    revisionsUnit: "days" // Added to handle the unit for revisions
  });
  const [successMessage, setSuccessMessage] = useState("");

  const removeFeature = (index) => {
    const clonedFeatures = [...features];
    clonedFeatures.splice(index, 1);
    setfeatures(clonedFeatures);
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const addFeature = () => {
    if (data.feature) {
      setfeatures([...features, data.feature]);
      setData({ ...data, feature: "" });
    }
  };

  const addGig = async () => {
    const { category, description, price, revisions, time, title, shortDesc, timeUnit, revisionsUnit } = data;
    let isValid = true;
    const errorMessages = [];

    if (!category) {
      isValid = false;
      errorMessages.push("Category is required.");
    }
    if (!description) {
      isValid = false;
      errorMessages.push("Description is required.");
    }
    if (!title) {
      isValid = false;
      errorMessages.push("Gig title is required.");
    }
    if (features.length === 0) {
      isValid = false;
      errorMessages.push("At least one feature is required.");
    }
    if (files.length === 0) {
      isValid = false;
      errorMessages.push("At least one image is required.");
    }
    if (price <= 0) {
      isValid = false;
      errorMessages.push("Price must be greater than 0.");
    }
    if (!shortDesc.length) {
      isValid = false;
      errorMessages.push("Short description is required.");
    }
    if (revisions <= 0) {
      isValid = false;
      errorMessages.push("Revisions must be greater than 0.");
    }
    if (time <= 0) {
      isValid = false;
      errorMessages.push("Delivery time must be greater than 0.");
    }

    if (!isValid) {
      alert(errorMessages.join("\n"));
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    const gigData = {
      title,
      description,
      category,
      features,
      price,
      revisions,
      time,
      shortDesc,
      timeUnit,
      revisionsUnit
    };

    try {
      const response = await axios.post(ADD_GIG_ROUTE, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${cookies.jwt}`,
        },
        params: gigData,
      });
      if (response.status === 201) {
        setSuccessMessage("Gig created successfully!");
        setTimeout(() => {
          setSuccessMessage("");
          router.push("/seller/gigs");
        }, 3000);
      }
    } catch (error) {
      console.error("Error creating gig:", error);
      alert("Failed to create gig. Please try again.");
    }
  };

  return (
    <div className="min-h-[80vh] my-10 mt-0 px-32">
      <h1 className="text-6xl text-gray-900 mb-5">Create a new Gig</h1>
      <h3 className="text-3xl text-gray-900 mb-5">
        Enter the details to create the gig
      </h3>
      {successMessage && (
        <div className="mb-4 p-3 text-green-700 bg-green-100 border border-green-300 rounded">
          {successMessage}
        </div>
      )}
      <form action="" className="flex flex-col gap-5 mt-10">
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="title" className={labelClassName}>
              Gig Title
            </label>
            <input
              name="title"
              value={data.title}
              onChange={handleChange}
              type="text"
              id="title"
              className={inputClassName}
              placeholder="e.g. I will create beautiful resin art"
              required
            />
          </div>
          <div>
            <label htmlFor="categories" className={labelClassName}>
              Select a Category
            </label>
            <select
              id="categories"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              name="category"
              onChange={handleChange}
              defaultValue="Choose a Category"
            >
              {categories.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="description" className={labelClassName}>
            Gig Description
          </label>
          <textarea
            id="description"
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Write a short description"
            name="description"
            value={data.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="delivery" className={labelClassName}>
              Delivery Time
            </label>
            <div className="flex">
              <input
                type="number"
                className={inputClassName}
                id="delivery"
                name="time"
                value={data.time}
                onChange={handleChange}
                placeholder="Time"
              />
              <select
                name="timeUnit"
                className={`${inputClassName} ml-2`}
                onChange={handleChange}
                value={data.timeUnit}
              >
                <option value="days">Days</option>
                <option value="minutes">Minutes</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="revision" className={labelClassName}>
              Revisions
            </label>
            <div className="flex">
              <input
                type="number"
                id="revision"
                className={inputClassName}
                placeholder="Revisions"
                name="revisions"
                value={data.revisions}
                onChange={handleChange}
              />
              <select
                name="revisionsUnit"
                className={`${inputClassName} ml-2`}
                onChange={handleChange}
                value={data.revisionsUnit}
              >
                <option value="days">Days</option>
                <option value="minutes">Minutes</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="features" className={labelClassName}>
              Features
            </label>
            <div className="flex gap-3 items-center mb-5">
              <input
                type="text"
                id="features"
                className={inputClassName}
                placeholder="Enter a Feature Name"
                name="feature"
                value={data.feature}
                onChange={handleChange}
              />
              <button
                type="button"
                className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 font-medium text-lg px-10 py-3 rounded-md"
                onClick={addFeature}
              >
                Add
              </button>
            </div>
            <ul className="flex gap-2 flex-wrap">
              {features.map((feature, index) => {
                return (
                  <li
                    key={feature + index.toString()}
                    className="flex gap-2 items-center py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-red-700 cursor-pointer hover:border-red-200"
                  >
                    <span>{feature}</span>
                    <span
                      className="text-red-700"
                      onClick={() => removeFeature(index)}
                    >
                      X
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div>
            <label htmlFor="image" className={labelClassName}>
              Gig Images
            </label>
            <div>
              <ImageUpload files={files} setFile={setFile} />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-11">
          <div>
            <label htmlFor="shortDesc" className={labelClassName}>
              Short Description
            </label>
            <input
              type="text"
              className={`${inputClassName} w-1/5`}
              id="shortDesc"
              placeholder="Enter a short description."
              name="shortDesc"
              value={data.shortDesc}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClassName}>
              Gig Price ( ₹ )
            </label>
            <input
              type="number"
              className={`${inputClassName} w-1/5`}
              id="price"
              placeholder="Enter a price"
              name="price"
              value={data.price}
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <button
            className="border text-lg font-semibold px-5 py-3 border-[#1DBF73] bg-[#1DBF73] text-white rounded-md"
            type="button"
            onClick={addGig}
          >
            Create
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateGigs;
