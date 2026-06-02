import { useForm } from "react-hook-form";
import { DepartmentTypes, ROLES } from "../../Enums/appEnums";
import { useEffect, useState } from "react";
import useUsers from "../../hooks/useUsers";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateUser = ({ viaOrganization, organizationId, userId = null, action = 'create' }) => {

  console.log("CreateUser Props:", { viaOrganization, organizationId, userId, action });

  const { createUser, updateUser, getUserProfile, error } = useUsers();

  const { register, handleSubmit, formState:{errors}, reset , watch } = useForm();
  
  const [isActive,setIsActive] = useState(!viaOrganization ? true : false);

  const navigate = useNavigate();

  const [showPasswordField, setShowPasswordField] = useState(true);

  const [modeAccess, setModeAccess] = useState({
    firstName: true,
    lastName: true,
    email: true,
    phoneNumber: true,
    employeeId: true,
    role: true,
    department: true,
    password: true,
  })

  useEffect(() => {
    
    if(!userId || action === 'create'){
        reset({
            firstName: '',
            lastName: '',
            email: '',
            phoneNumber: '',
            employeeId: '',
            role: '',
            department: '',
            password: '',
            isActive: !viaOrganization ? true : false,
        });

        setModeAccess({
            firstName: true,
            lastName: true,
            email: true,
            phoneNumber: true,
            employeeId: true,
            role: true,
            department: true,
            password: true,
        });

        setShowPasswordField(true); // Show password fields in create mode

        return;
    }

    const fetchUserProfile = async () => {

      const response = await getUserProfile(userId);

      if(!response){
        toast.error(error || "Failed to fetch user profile");
        return;
      }

      if(response.success && response.data){

        const userData = response.data;

        reset({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phoneNumber: userData.phoneNumber || '',
            employeeId: userData.employeeId || '',
            role: userData.role || '',
            department: userData.department || '',
            password: '', // Do not prefill password
            isActive: userData.isActive
        });

        setShowPasswordField(false); // Hide password fields in edit mode

        if(action === 'edit'){

            setModeAccess({
                firstName: true,
                lastName: true,
                email: false,
                phoneNumber: true,
                employeeId: true,
                role: true,
                department: true,
                password: false, // Disable password field in edit mode
            });
        }

        if(action === 'view'){
            setModeAccess({
                firstName: false,
                lastName: false,
                email: false,
                phoneNumber: false,
                employeeId: false,
                role: false,
                department: false,
                password: false, // Disable password field in view mode
            });
         }
      }
    }

    fetchUserProfile();

  },[userId]);

 
  const onSubmit = async (data) => {

    console.log("Form Data:", data);

    if(viaOrganization && organizationId){

        var payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            employeeId: data.employeeId,
            role: data.role,
            department: data.department,
            password: data.password,
            isActive: isActive,
            viaOrganization: viaOrganization ? true : false,
            organizationId: organizationId
        }

        if(action === 'edit'){

            const Editpayload = {
                id: userId,
                ...payload
            }
            
            const response = await updateUser(Editpayload);
            
            if(!response){
                toast.error(error || "Failed to update user");
                return;
            }

            if(response.success){
                toast.success(response.message || "User updated successfully");
                reset();
                navigate('/users/list'); // Redirect to login after successful registration
            }
            else{
                toast.error(response.message || "Failed to update user");
            }

        }
        else {

            const response = await createUser(payload);

            if(!response){
                toast.error(error || "Failed to create user");
                return;
            }

            if(response.success){
                toast.success(response.message || "User created successfully");
                reset();
            }
            else{
                toast.error(response.message || "Failed to create user");
            }

            reset();
        }      
    }
    else{

        // New Registration flow without organization context

        var payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            phoneNumber: data.phoneNumber,
            employeeId: data.employeeId,
            role: data.role,
            department: data.department,
            password: data.password,
        }

        const response = await createUser(payload);

        if(!response){
            toast.error(error || "Failed to create user");
            return;
        }


        if(response.success){
            toast.success(response.message || "User created successfully");
            reset();
            navigate('/'); // Redirect to login after successful registration
        }
        else{
            toast.error(response.message || "Failed to create user");
        }

    }
  }

  const handleCancel = () => {
    if(viaOrganization){
        navigate('/users/list');
    }
    else{
        navigate('/');  
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-slate-200">
        {/* Header */}
        <div className="px-8 py-6 border-b">
            <h1 className="text-2xl font-bold text-slate-900">
            {viaOrganization
                ? action === "edit"
                ? "Edit User for Organization"
                : viaOrganization && action === "create" ? "Create New User for Organization" : viaOrganization && action === "view" ? "Organization User " : "Create Account"
                : "Create Account"}
            </h1>

          <p className="text-sm text-slate-500 mt-1">
            {viaOrganization && action == 'create' ? "Fill in the information below to register a new employee for the organization." : viaOrganization && action == 'edit' ? "Fill in the information below to edit the employee information for the organization." : viaOrganization && action == 'view' ? '':"Fill in the information below to create your account."}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}  className="p-8 space-y-8">
          {/* Personal Information */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  First Name
                </label>
                <input {...register('firstName',
                    {required:'First name is required',
                    minLength:{value:2,message:'First name must be at least 2 characters'},
                    maxLength:{value:30,message:'First name must be at most 30 characters'},
                    pattern:{value:/^[A-Za-z]+$/,message:'First name can only contain letters'}
                })}
                  type="text"
                  placeholder="John"
                  name="firstName"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  disabled={!modeAccess.firstName}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Last Name
                </label>
                <input {...register('lastName',
                    {required:'Last name is required',
                    minLength:{value:2,message:'Last name must be at least 2 characters'},
                    maxLength:{value:30,message:'Last name must be at most 30 characters'},
                    pattern:{value:/^[A-Za-z]+$/,message:'Last name can only contain letters'}
                })}
                  type="text"
                  placeholder="Doe"
                  name="lastName"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  disabled={!modeAccess.lastName}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Email Address
                </label>
                <input {...register('email',
                    {required:'Email is required',
                    pattern:{value:/^[^\s@]+@[^\s@]+\.[^\s@]+$/,message:'Invalid email address'}
                })}
                  type="email"
                  placeholder="john.doe@company.com"
                  name="email"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  disabled={!modeAccess.email}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Mobile Number
                </label>
                <input {...register('phoneNumber',
                    {required:'Phone number is required',
                    pattern:{value:/^\+?[1-9]\d{1,14}$/,message:'Invalid phone number'}
                })}
                  type="tel"
                  placeholder="+91 9876543210"
                  name="phoneNumber"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  disabled={!modeAccess.phoneNumber}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>}
              </div>
            </div>
          </section>

          {/* Employment Information */}
          <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Employment Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Employee ID
                </label>
                <input {...register('employeeId',
                    {required:'Employee ID is required',
                    minLength:{value:3,message:'Employee ID must be at least 3 characters'},
                    maxLength:{value:10,message:'Employee ID must be at most 10 characters'}
                })}
                  type="text"
                  placeholder="EMP001"
                  name="employeeId"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  disabled={!modeAccess.employeeId}
                />
                {errors.employeeId && <p className="text-red-500 text-sm mt-1">{errors.employeeId.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <select {...register('role', { required: 'Role is required' })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" disabled={!modeAccess.role}>
                  <option value="">Select Role</option>
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
                {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Department
                </label>
                <select {...register('department', { required: 'Department is required' })} className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none" disabled={!modeAccess.department}>
                  <option value="">Select Department</option>
                  {DepartmentTypes.map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </select>
                {errors.department && <p className="text-red-500 text-sm mt-1">{errors.department.message}</p>}
              </div>
            </div>
          </section>

          {/* Security */}
         <section>
            <h2 className="text-lg font-semibold text-slate-800 mb-4">
              Security
            </h2>

            {showPasswordField && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input {...register('password',
                    {required:'Password is required',
                    minLength:{value:8,message:'Password must be at least 8 characters'},
                    maxLength:{value:20,message:'Password must be at most 20 characters'}
                })}
                  type="password"
                  placeholder="Enter password"
                  name="password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                  disabled={!modeAccess.password}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm Password
                </label>
                <input {...register('confirmPassword', {
                    required: 'Confirm Password is required',
                    validate: (value) => value === watch('password') || 'Passwords do not match'
                })}
                  type="password"
                  placeholder="Confirm password"
                  className="w-full rounded-lg border border-slate-300 px-4 py-2.5 focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>
              )}
            <div className="mt-4 text-sm text-slate-500">
                
                <div className="flex items-center gap-3 md:col-span-2">
                     <input {...register('isActive')}
                        type="checkbox"
                        id="isActive"
                        checked={isActive}
                        disabled={!viaOrganization}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                     />
                    <label className="text-sm font-medium text-slate-700">
                        Active User
                    </label>
                </div>

            </div>

            </section>

        

          {/* Actions */}
          {
            action !== 'view' && (
            <div className="flex justify-end gap-3 pt-4 border-t">
              <button
                type="button"
                onClick={handleCancel}
                className="px-5 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                className="px-6 py-2.5 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition"
              >
                { viaOrganization && action == 'edit' ? 'Update Profile':viaOrganization && action == 'create' ? 'Create Account' : 'Create Account' }
              </button>
            </div>
          )
        }
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
