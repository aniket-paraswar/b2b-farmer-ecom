import React, { useState } from 'react';
import './LoginSignup.css';

// List of Indian states and their districts
const statesAndDistricts = {
    AndhraPradesh: ["Anantapur", "Chittoor", "Guntur", "Kadapa", "Krishna", "Kurnool", "Nellore", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "East Godavari"],
    ArunachalPradesh: ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Upper Siang"],
    Assam: ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Jorhat", "Kamrup", "Karbi Anglong", "Kokrajhar", "Lakhimpur", "Morigaon", "Nagaon", "Nalbari", "Sivasagar", "Sonitpur", "Tinsukia", "Dima Hasao", "Karimganj"],
    Bihar: ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Madhepura", "Madhubani", "Nalanda", "Nawada", "Purnia", "Rohtas", "Saran", "Sheikhpura", "Sitamarhi", "Supaul", "Vaishali", "West Champaran"],
    Chhattisgarh: ["Balod", "Baloda Bazar", "Bemetara", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Kabirdham", "Kanker", "Korba", "Mahasamund", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surguja"],
    Goa: ["North Goa", "South Goa"],
    Gujarat: ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Dahod", "Dangs", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kutch", "Mahisagar", "Mehsana", "Narmada", "Navsari", "Panchmahal", "Patan", "Sabarkantha", "Surat", "Surendranagar", "Vadodara", "Valsad"],
    Haryana: ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Panchkula", "Pehowa", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
    HimachalPradesh: ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
    Jharkhand: ["Bokaro", "Chatra", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ranchi", "Sahibganj", "Saraikela Kharsawan", "West Singhbhum"],
    Karnataka: ["Bagalkote", "Bangalore", "Bangalore Rural", "Belgaum", "Bellary", "Bidar", "Chamarajanagar", "Chikkamagaluru", "Chitradurga", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysore", "Raichur", "Ramanagara", "Shimoga", "Tumkur", "Udupi", "Uttara Kannada"],
    Kerala: ["Alappuzha", "Ernakulam", "Idukki", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
    MadhyaPradesh: ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Shajapur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
    Maharashtra: ["Ahmednagar", "Akola", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gandhinagar", "Kolhapur", "Latur", "Mumbai", "Nagpur", "Nanded", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
    Manipur: ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Senapati", "Tamenglong", "Tengnoupal", "Ukhrul", "Noney", "Pherzawl"],
    Meghalaya: ["East Garo Hills", "East Khasi Hills", "Jaintia Hills", "West Garo Hills", "West Khasi Hills"],
    Mizoram: ["Aizawl", "Champhai", "Khawzawl", "Kolasib", "Lawngtlai", "Lunglei", "Saiha", "Serchhip"],
    Nagaland: ["Dimapur", "Kiphire", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
    Odisha: ["Angul", "Boudh", "Bolangir", "Dhenkanal", "Ganjam", "Ganjam", "Kalahandi", "Kandhamal", "Khurda", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Sonepur", "Deogarh", "Jagatsinghpur", "Jajpur", "Kendrapara"],
    Punjab: ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Gurdaspur", "Hoshiarpur", "Jalandhar", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Patiala", "Rupnagar", "Sangrur", "Shaheed Bhagat Singh Nagar"],
    Rajasthan: ["Ajmer", "Alwar", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhunjhunu", "Karauli", "Nagaur", "Pali", "Rajsamand", "Sawai Madhopur", "Sikar", "Tonk"],
};

export const LoginSignup = () => {
    const [state, setState] = useState("Sign Up");
    const [formData, setFormData] = useState({
        name: "", 
        phone: "",
        password: "",
        state: "",
        district: "",
    });

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const login = async () => {
        console.log("Login Function Executed", formData);
        let responseData;
        await fetch('http://localhost:9813/farmers/signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phone: formData.phone, password: formData.password }) 
        })
            .then((response) => response.json())
            .then((data) => responseData = data);
        
        if (responseData.result) {
            localStorage.setItem('x-access-token', responseData.token); 
            window.location.replace("/"); 
        } else {
            alert(responseData.error);
        }
    };

    const signup = async () => {
        console.log("Sign Up Function Executed", formData);
        let responseData;
        await fetch('http://localhost:9813/farmers/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
            .then((response) => response.json())
            .then((data) => responseData = data);
        
        if (responseData.result) {
            alert(responseData.message);
            setState("Login"); 
        } else {
            alert(responseData.error);
        }
    };

    return (
        <div className='loginSignup'>
            <div className="loginSignup-container">
                <h1>{state}</h1>
                <div className="loginSignup-fields">
                    {state === 'Sign Up' && (
                        <>
                            <input type="text" name="name" value={formData.name} onChange={changeHandler} placeholder='Your name' />
                            <select name="state" value={formData.state} onChange={changeHandler}>
                                <option value="">Select State</option>
                                {Object.keys(statesAndDistricts).map((stateName) => (
                                    <option key={stateName} value={stateName}>{stateName.replace(/([A-Z])/g, ' $1').trim()}</option>
                                ))}
                            </select>
                            <select name="district" value={formData.district} onChange={changeHandler} disabled={!formData.state}>
                                <option value="">Select District</option>
                                {formData.state && statesAndDistricts[formData.state].map((districtName) => (
                                    <option key={districtName} value={districtName}>{districtName}</option>
                                ))}
                            </select>
                        </>
                    )}
                    <input type="text" name="phone" value={formData.phone} onChange={changeHandler} placeholder='Phone' />
                    <input type="password" name="password" value={formData.password} onChange={changeHandler} placeholder='Password' />
                </div>
                <button onClick={() => { state === 'Login' ? login() : signup() }}>
                    Continue
                </button>
                {state === 'Sign Up' ? (
                    <p className="loginSignup-login">
                        Already have an account
                        <span onClick={() => { setState("Login") }}>
                            Login
                        </span>
                    </p>
                ) : (
                    <p className="loginSignup-login">
                        Create an account
                        <span onClick={() => { setState("Sign Up") }}>
                            Sign Up
                        </span>
                    </p>
                )}
                <div className="loginSignup-agree">
                    <input type="checkbox" />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
            </div>
        </div>
    );
};
