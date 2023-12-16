import { useEffect, useState } from "react";
import { BsArrowLeftShort } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../../../Components/shared/Breadcrumb/Breadcrumb";
import { ToastContainer, toast } from "react-toastify";
import {
  fetchLoanBene,
  updateLoanBeneficiary,
} from "../../../redux/Actions/ExpensesActions";
import MainForm from "../../../Components/shared/Forms/MainForm";

const Expenseedit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const reduxState = useSelector((state) => state.expenseSliceReducers);
  const location = useLocation();
  const state = reduxState.sData;

  console.log("sate: ", state);

  useEffect(() => {
    dispatch(fetchLoanBene(location.state));
  }, [location.state, dispatch]);

  const formsData = [
    {
      fieldName: "Expenser Name",
      fieldType: "text",
      fieldPlaceholder: "Expenser Name",
      isRequired: false,
      defaultValue: state.expenser_name,
    },
    {
      fieldName: "Expense Date",
      fieldType: "datetime-local",
      fieldPlaceholder: "Rate",
      isRequired: false,
      defaultValue: state.expense_date,
    },

    {
      fieldName: "Reason",
      fieldType: "text",
      fieldPlaceholder: "Reason",
      isRequired: false,
      defaultValue: state.reason,
    },
    {
      fieldName: "Amount",
      fieldType: "number",
      fieldPlaceholder: "Amount",
      isRequired: false,
      defaultValue: state.amount,
    },
    {
      fieldName: "Documents",
      fieldType: "file",
      fieldPlaceholder: "Upload your documents",
      isRequired: false,
      defaultValue: state.documents,
    },
  ];
  const submitFunction = (data) => {
    if (state) {
      console.log(data.contructor_id, "From update page");
      const updatedData = {
        id: state.id,
        status: data.status ? data.status : state.status,
        expenser_name: data.expenser_name
          ? data.expenser_name
          : state.expenser_name,
        amount: data.amount ? data.amount : state.amount,
        expense_date: data.expense_date
          ? data.expense_date
          : state.expense_date,
        documents: data.documents ? data.documents : null,
        reason: data.reason ? data.reason : state.reason,
      };
      dispatch(
        updateLoanBeneficiary({
          id: state.id,
          data: updatedData,
        })
      );
    }
  };

  // In a useEffect or similar, check the updated state
  useEffect(() => {
    if (reduxState.isUpdate) {
      // Perform actions after the update is successful
      toast("Successfully done", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setTimeout(() => {
        navigate("/expense");
      }, 3000);
    }
  }, [reduxState.isUpdate, navigate]);

  return (
    <>
      <div className="flex items-center justify-between gap-4 mb-4">
        <Breadcrumb />
        <div className="flex space-x-4">
          <Link
            to={"/expense"}
            className="btn btn-sm font-semibold flex gap-2 items-center justify-center bg-erp_primary text-erp_light px-2"
          >
            <BsArrowLeftShort /> Back
          </Link>
        </div>
      </div>
      <div className="bg-white shadow-lg shadow-blue-200 md:mx-10 mb-5 rounded-lg md:p-4">
        <MainForm
          formsData={formsData}
          submitFunction={submitFunction}
          isState={state}
        />
      </div>

      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default Expenseedit;
