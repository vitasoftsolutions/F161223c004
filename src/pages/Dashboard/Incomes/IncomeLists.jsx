import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableHeader from "../../../Components/shared/TableHeader/TableHeader";
import Swal from "sweetalert2";
import {
  deleteLoanBeneficiary,
  fetchIncomeList,
  searchIncome,
} from "../../../redux/Actions/IncomeActions";
import GlobalTable from "../../../Components/shared/Tables/GlobalTable";

const t_head = [
  { name: "Income Name" },
  { name: "Amount" },
  { name: "Entry Date" },
  { name: "Income Date" },
  { name: "Status" },
  { name: "Action" },
];

const formsData = [
  {
    fieldName: "Income Name",
    fieldType: "text",
    fieldPlaceholder: "Income Name",
  },
  {
    fieldName: "Amount",
    fieldType: "number",
    fieldPlaceholder: "Amount",
  },
];


//date function
function extractDate(dateTimeString) {
  // Create a new Date object from the provided string
  const date = new Date(dateTimeString);

  // Extract the individual date components
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1; // Months are zero-based
  const day = date.getUTCDate();

  // Create the formatted date string
 
  const formattedDate = `${day < 10 ? "0" : ""}${day}/${
    month < 10 ? "0" : ""
  }${month}/${year}`;

  return formattedDate;
}

const IncomeLists = () => {

  const dispatch = useDispatch();
  const state = useSelector((state) => state.incomeSliceReducers);

  console.log(state, "state")

  // allDataList
  const allDataList = state.data;
  console.log(state.data);
  const newData = state?.data?.map((item) => ({
    id: item.id,
    first_name: item.income_name,
    amount: item.amount,
    date: item.created_at,
    income_date: extractDate(item.income_date),
    status: item.status,
  }));
  const tableData = {
    ...state,
    data: newData,
  };
  console.log(tableData);
  //
  const current_page = state.currentPage;
  const total_page = state.totalPages;

  // Pages
  let page_number = [];
  for (let i = current_page - 1; i <= current_page + 1; i++) {
    if (i < 1) continue;
    if (i > total_page) break;
    page_number.push(i);
  }

  useEffect(() => {
    dispatch(fetchIncomeList(current_page));
  }, [dispatch, current_page, state.isDelete]);

  const handlePageChange = (newPage) => {
    dispatch(fetchIncomeList(newPage));
  };

  const deleteFunction = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteLoanBeneficiary(id));
        if (state.isDelete === true) {
          Swal.fire("Deleted!", "Your file has been deleted.", "success");
        }
      }
    });
  };


    // Filter Code
    const handleSearch = (formData) => {
      const allKeysEmpty = Object.values(formData).every(
        (value) => value === "" || value === null
      );
      const app_model = "accounts/Income/";
      const serializer_class = "Income";
      const searchData = { formData, app_model, serializer_class };
      if (allKeysEmpty) {
        // If the search field is empty, fetch all formData
        dispatch(fetchIncomeList(current_page));
      } else {
        dispatch(searchIncome(searchData));
      }
    };

  return (
    <div className="max-w-screen">
      <TableHeader
        title={"Incomes"}
        redirectLink={"/income/create"}
        // For Export & Import
        url_endpoint={"/export-csv/?model=income&app_label=accounts"}
        model_name={"income"}
        app_label={"accounts"}
        // For filters
        onSearch={handleSearch}
        formsData={formsData}
      />
      <GlobalTable
        t_head={t_head}
        t_data={tableData}
        allDataList={allDataList}
        handlePageChange={handlePageChange}
        current_page={current_page}
        page_number={page_number}
        deleteFunction={deleteFunction}
        editLink={"/income/edit"}
        erp_modalCol={12}
        photoSection={false}
      />
    </div>
  );
};

export default IncomeLists;
