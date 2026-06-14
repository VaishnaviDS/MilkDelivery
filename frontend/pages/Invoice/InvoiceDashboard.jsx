import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { FaWhatsapp, FaFileInvoice, FaCheck } from "react-icons/fa";
import "./invoiceDashboard.css";

const InvoiceDashboard = () => {
  const {
    families,
    fetchFamilies,
    generateInvoice,
    getInvoicesByFamily,
    markInvoicePaid,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [invoiceUrl, setInvoiceUrl] = useState("");
  const [loadingId, setLoadingId] = useState(null);
  const [invoiceMap, setInvoiceMap] = useState({});
  const [selectedInvoice, setSelectedInvoice] = useState({});

  useEffect(() => {
    fetchFamilies(search);
  }, [search]);

  useEffect(() => {
    if (families.length > 0) {
      loadAllInvoices();
    }
  }, [families]);

  const loadAllInvoices = async () => {
    const tempMap = {};
    const tempSelected = {};

    for (const family of families) {
      const invoices = await getInvoicesByFamily(
        family._id
      );

      tempMap[family._id] = invoices || [];

      if (invoices?.length > 0) {
        tempSelected[family._id] =
          invoices[invoices.length - 1];
      }
    }

    setInvoiceMap(tempMap);
    setSelectedInvoice(tempSelected);
  };

  const handleGenerate = async (familyId) => {
    try {
      setLoadingId(familyId);

      const invoices = invoiceMap[familyId] || [];
      const nextIndex = invoices.length;

      const data = await generateInvoice(
        familyId,
        nextIndex
      );

      if (data?.url) {
        setInvoiceUrl(data.url);
      }

      await loadAllInvoices();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingId(null);
    }
  };

  const handleSelect = (familyId, index) => {
    const invoices = invoiceMap[familyId] || [];

    setSelectedInvoice((prev) => ({
      ...prev,
      [familyId]: invoices[index],
    }));
  };

  const handlePaid = async (invoice) => {
    if (!invoice || invoice.status === "Paid")
      return;

    if (
      !window.confirm("Mark invoice as paid?")
    )
      return;

    await markInvoicePaid(invoice._id);
    await loadAllInvoices();
  };

  const handleWhatsappShare = (invoice) => {
    if (!invoice?.pdfUrl) return;

    const text = `
Hello,

Your milk invoice is ready.

Invoice Number: ${invoice.invoiceNumber}
Total Amount: ₹${invoice.totalAmount}

Invoice Link:
${invoice.pdfUrl}
`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        text
      )}`,
      "_blank"
    );
  };

  return (
    <div className="invoice-page">
      <h1 className="invoice-title">
        📄 Invoice Dashboard
      </h1>

      <input
        type="text"
        className="invoice-search"
        placeholder="Search family..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
      />

      <div className="invoice-table-container">
        <table className="invoice-table">
          <thead>
            <tr>
              <th>Family</th>
              <th>Invoices</th>
              <th>Generate</th>
              <th>Status</th>
              <th>Share</th>
            </tr>
          </thead>

          <tbody>
            {families.map((family) => {
              const invoices =
                invoiceMap[family._id] || [];

              const selected =
                selectedInvoice[family._id];

              return (
                <tr key={family._id}>
                  <td>{family.name}</td>

                  <td>
                    {invoices.length === 0 ? (
                      <span className="no-invoice">
                        No invoices
                      </span>
                    ) : (
                      <select
                        className="invoice-select"
                        value={
                          invoices.findIndex(
                            (inv) =>
                              inv._id ===
                              selected?._id
                          ) || 0
                        }
                        onChange={(e) =>
                          handleSelect(
                            family._id,
                            e.target.value
                          )
                        }
                      >
                        {invoices.map(
                          (inv, i) => (
                            <option
                              key={inv._id}
                              value={i}
                            >
                              {new Date(
                                inv.startDate
                              ).toLocaleDateString()}
                              {" - "}
                              {new Date(
                                inv.endDate
                              ).toLocaleDateString()}
                            </option>
                          )
                        )}
                      </select>
                    )}
                  </td>

                  <td>
                    <button
                      className="generate-btn"
                      onClick={() =>
                        handleGenerate(
                          family._id
                        )
                      }
                      disabled={
                        loadingId ===
                        family._id
                      }
                    >
                      <FaFileInvoice />
                      {loadingId ===
                      family._id
                        ? " Generating..."
                        : " Generate"}
                    </button>
                  </td>

                  <td>
                    {selected ? (
                      <button
                        className={`status-btn ${
                          selected.status ===
                          "Paid"
                            ? "paid"
                            : "pending"
                        }`}
                        onClick={() =>
                          handlePaid(selected)
                        }
                        disabled={
                          selected.status ===
                          "Paid"
                        }
                      >
                        <FaCheck />
                        {selected.status}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td>
                    {selected?.pdfUrl && (
                      <button
                        className="whatsapp-btn"
                        onClick={() =>
                          handleWhatsappShare(
                            selected
                          )
                        }
                      >
                        <FaWhatsapp />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {invoiceUrl && (
        <div className="invoice-preview">
          <h3>📑 Invoice Preview</h3>

          <iframe
            src={`${invoiceUrl}?t=${Date.now()}`}
            title="Invoice PDF"
            className="invoice-frame"
          />

          <div className="invoice-links">
            <a
              href={invoiceUrl}
              target="_blank"
              rel="noreferrer"
            >
              Open Invoice
            </a>

            <a href={invoiceUrl} download>
              Download Invoice
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceDashboard;