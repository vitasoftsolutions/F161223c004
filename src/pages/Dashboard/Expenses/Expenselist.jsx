import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TableHeader from "../../../Components/shared/TableHeader/TableHeader";
import Swal from "sweetalert2";
import {
  deleteLoanBeneficiary,
  fetchLoanBeneList,
  searchExpenses,
} from "../../../redux/Actions/ExpensesActions";
import GlobalTable from "../../../Components/shared/Tables/GlobalTable";

const t_head = [
  { name: "Expenser Name" },
  { name: "Amount" },
  { name: "Entry Date" },
  { name: "Expense Date" },
  { name: "Status" },
  { name: "Action" },
];

const formsData = [
  {
    fieldName: "Expenser Name",
    fieldType: "text",
    fieldPlaceholder: "Expenser Name",
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
  //const formattedDate = `${year}/${month < 10 ? '0' : ''}${month}/${day < 10 ? '0' : ''}${day}`;
  const formattedDate = `${day < 10 ? "0" : ""}${day}/${
    month < 10 ? "0" : ""
  }${month}/${year}`;

  return formattedDate;
}

const Expenselist = () => {
  const [name, setName] = useState("");

  console.log("name: ", name);
  const dispatch = useDispatch();
  const state = useSelector((state) => state.expenseSliceReducers);

  // allDataList
  const allDataList = state.data;
  console.log(state.data);
  const newData = state?.data?.map((item) => ({
    id: item.id,
    first_name: item.expenser_name,
    amount: item.amount,
    date: item.created_at,
    expense_date: extractDate(item.expense_date),
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
    dispatch(fetchLoanBeneList(current_page));
  }, [dispatch, current_page, state.isDelete]);

  const handlePageChange = (newPage) => {
    dispatch(fetchLoanBeneList(newPage));
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
    const app_model = "accounts/Expense/";
    const serializer_class = "Expense";
    const searchData = { formData, app_model, serializer_class };
    if (allKeysEmpty) {
      // If the search field is empty, fetch all formData
      dispatch(fetchLoanBeneList(current_page));
    } else {
      dispatch(searchExpenses(searchData));
    }
  };

  return (
    <div className="max-w-screen">
      <TableHeader
        title={"Expenses"}
        redirectLink={"/expense/create"}
        // For Export & Import
        model_name={"Expense"}
        app_label={"accounts"}
        url_endpoint={"/export-csv/?model=Expense&app_label=accounts"}
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
        editLink={"/expense/edit"}
        erp_modalCol={12}
        photoSection={false}
      />
    </div>
  );
};

export default Expenselist;
