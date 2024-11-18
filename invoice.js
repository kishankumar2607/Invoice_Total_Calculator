"use strict";

// Function to format date in MM/DD/YYYY format
const formatDate = (date) => {
  let month = date.getMonth() + 1; // Months are zero-indexed in JS
  let day = date.getDate();
  let year = date.getFullYear();

  // Ensure double digits for month and day
  if (month < 10) month = "0" + month;
  if (day < 10) day = "0" + day;

  return `${month}/${day}/${year}`;
};

// Function to calculate discount based on customer type and subtotal
const calculateDiscount = (customer, subtotal) => {
  if (customer === "reg") {
    if (subtotal >= 100 && subtotal < 250) {
      return 0.1;
    } else if (subtotal >= 250 && subtotal < 500) {
      return 0.25;
    } else if (subtotal >= 500) {
      return 0.3;
    } else {
      return 0;
    }
  } else if (customer === "loyal") {
    return 0.3;
  } else if (customer === "honored") {
    if (subtotal < 500) {
      return 0.4;
    } else {
      return 0.5;
    }
  }
};

$(document).ready(() => {
  // Automatically add "/" after the user types in the month and day
  $("#invoice_date").on("input", function (e) {
    let value = $(this).val();

    // Detect if the user is pressing backspace
    if (e.originalEvent.inputType === "deleteContentBackward") {
      if (value.length === 3 || value.length === 6) {
        $(this).val(value.slice(0, -1));
      }
      return;
    }

    // Automatically add "/" after the month (MM)
    if (value.length === 2 && !value.includes("/")) {
      $(this).val(value + "/");
    }

    // Automatically add "/" after the day (DD)
    if (
      value.length === 5 &&
      value.charAt(2) === "/" &&
      !value.slice(3).includes("/")
    ) {
      $(this).val(value + "/");
    }
  });

  // Click event handler for the "Calculate" button
  $("#calculate").click(() => {
    const customerType = $("#type").val();
    let subtotal = $("#subtotal").val();
    subtotal = parseFloat(subtotal);

    // Validate subtotal
    if (isNaN(subtotal) || subtotal <= 0) {
      alert("Subtotal must be a number greater than zero.");
      $("#clear").click();
      $("#subtotal").focus();
      return;
    }

    // Get the invoice date
    let invoiceDateStr = $("#invoice_date").val();
    let invoiceDate;

    // If no invoice date is provided, use the current date
    if (invoiceDateStr === "") {
      invoiceDate = new Date();
      invoiceDateStr = formatDate(invoiceDate); // Format current date
      $("#invoice_date").val(invoiceDateStr); // Set the formatted date in input
    } else {
      // Try to create a Date object from the entered string
      invoiceDate = new Date(invoiceDateStr);

      // Validate the invoice date
      if (isNaN(invoiceDate.getTime())) {
        // Invalid date
        alert("Please enter a valid date in MM/DD/YYYY format.");
        $("#clear").click();
        $("#invoice_date").focus();
        return;
      }
    }

    // Calculate discount and total
    const discountPercent = calculateDiscount(customerType, subtotal);
    const discountAmount = subtotal * discountPercent;
    const invoiceTotal = subtotal - discountAmount;

    // Set the calculated values in the fields
    $("#subtotal").val(subtotal.toFixed(2));
    $("#percent").val((discountPercent * 100).toFixed(2));
    $("#discount").val(discountAmount.toFixed(2));
    $("#total").val(invoiceTotal.toFixed(2));

    // Calculate the due date (30 days after invoice date)
    let dueDate = new Date(invoiceDate);
    dueDate.setDate(dueDate.getDate() + 30); // Add 30 days to the invoice date
    const dueDateStr = formatDate(dueDate);

    // Set the due date field
    $("#due_date").val(dueDateStr);

    // Set focus on the type drop-down when done
    $("#type").focus();
  });

  // Click event handler for the "Clear Entries" button
  $("#clear").click(() => {
    $("#type").val("reg");
    $("#subtotal").val("");
    $("#invoice_date").val("");
    $("#percent").val("");
    $("#discount").val("");
    $("#total").val("");
    $("#due_date").val("");

    // Set focus on type drop-down
    $("#type").focus();
  });

  // Set focus on the type drop-down on page load
  $("#type").focus();
});
