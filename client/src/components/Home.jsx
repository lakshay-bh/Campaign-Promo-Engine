import { Button } from "@nextui-org/button";
import { googleLogout } from "@react-oauth/google";
import { Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import {toast} from "react-toastify";
import axios from "axios";

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    function logOut() {
        localStorage.clear();
        googleLogout();
        navigate("/");
    }

    const populateCustomerTable = async () => {
        try {
            const response = await axios.post(
                "https://xenoassignment.onrender.com/customers",
                {
                    name: `Random User ${Math.random()}`,
                    email: `randomuser${Math.random()}@example.com`,
                    totalSpends: Math.floor(Math.random() * 1000),
                    maxVisits: Math.floor(Math.random() * 100),
                    lastVisit: new Date().toISOString(),
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                toast.success("Customer table populated successfully!");
            } else {
                const data = response.data;
                if (data.errors) {

                    alert(`Validation Errors: ${data.errors.map((err) => err.msg).join(", ")}`);
                } else {
                    alert(`Error: ${data.message || "Failed to populate customer table"}`);
                }
            }
        } catch (error) {
            console.error("Error populating customer table:", error);
            if (error.response && error.response.data) {
                const { message, errors } = error.response.data;
                if (errors) {
                    alert(`Validation Errors: ${errors.map((err) => err.msg).join(", ")}`);
                } else {
                    alert(`Error: ${message || "An error occurred"}`);
                }
            } else {
                alert("An error occurred while populating the customer table.");
            }
        }
    };


    if (token) {
        return (
            <>
                <Header />
                <div className="mt-28 flex flex-col items-center justify-center  rounded-full bg-customPurple  px-6 py-12">
                    <div className="bg-white rounded-lg shadow-md p-10 text-center">
                        <h1 className="text-3xl font-bold mb-4 text-purple-700">
                            Welcome to Your Dashboard!
                        </h1>
                        <p className="text-lg text-gray-600 mb-8">
                            Manage your audience and campaigns easily.
                        </p>

                        <div className="flex flex-col md:flex-row gap-4">
                            <Button
                                className="bg-purple-700 text-white w-full md:w-auto px-8 py-3 rounded-lg"
                                onClick={() => navigate("/create-audience")}
                            >
                                Create Audience
                            </Button>
                            <Button
                                className="bg-purple-700 text-white w-full md:w-auto px-8 py-3 rounded-lg"
                                onClick={() => navigate("/manage-campaigns")}
                            >
                                Manage Campaigns
                            </Button>
                        </div>

                        <Button
                            className="mt-4 bg-purple-700 text-white px-6 py-2 rounded-lg mr-3"
                            onClick={populateCustomerTable}
                        >
                            Populate Customer Table
                        </Button>

                        <Button
                            className="mt-8 bg-red-500 text-white px-6 py-2 rounded-lg"
                            onClick={logOut}
                        >
                            Log Out
                        </Button>
                    </div>
                </div>
            </>
        );
    } else {
        return <Navigate to="/" />;
    }
};

export default Home;
