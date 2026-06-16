// ═══════════════════════════════════════════════════════════════════
//  RegioMart Experiment — Google Apps Script Backend
//  Paste this entire file into: Extensions → Apps Script → Code.gs
//  Then: Deploy → New deployment → Web app → Execute as: Me
//         → Who has access: Anyone → Deploy → copy the URL
//  Paste that URL into index.html as BACKEND_URL
// ═══════════════════════════════════════════════════════════════════

// Exact column order — must match makeResult() in index.html
var COLUMNS = [
  "study_name",
  "prototype_version",
  "participant_id",
  "condition",
  "timestamp",

  // Control variables
  "age",
  "education",
  "work_experience",
  "excel_experience",
  "dashboard_experience",
  "data_analysis_experience",
  "color_vision",

  // Task presentation
  "task_order",

  // Decision accuracy
  "q1_answer",
  "q2_answer",
  "q3_answer",
  "q4_answer",
  "q5_answer",
  "q1_correct",
  "q2_correct",
  "q3_correct",
  "q4_correct",
  "q5_correct",
  "accuracy_score",
  "accuracy_percent",

  // Decision speed (seconds)
  "time_q1",
  "time_q2",
  "time_q3",
  "time_q4",
  "time_q5",
  "total_time_seconds",

  // Cognitive load (adapted NASA-TLX)
  "cl_mental_demand",
  "cl_difficulty",
  "cl_time_pressure",
  "cl_effort",
  "cl_frustration",
  "cl_confidence",

  // Manipulation check
  "used_condition",
  "perceived_interactivity",
  "perceived_clarity",

  // Device / screen controls (added per midterm feedback)
  "screen_width",
  "screen_height",
  "viewport_width",
  "viewport_height",
  "device_pixel_ratio",
  "color_depth",
  "device_type",
  "orientation",
  "touch_support",
  "platform",
  "language",
  "user_agent",

  // Open feedback
  "feedback"
];

// ── doPost: receives each participant submission ──────────────────
function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Responses") || ss.getActiveSheet();

    // Write header row automatically if the sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(COLUMNS);
      sheet.getRange(1, 1, 1, COLUMNS.length)
        .setFontWeight("bold")
        .setBackground("#0d1f3c")
        .setFontColor("#ffffff");
      sheet.setFrozenRows(1);
    }

    // Build the data row in the same order as COLUMNS
    var params = e.parameter;
    var row = COLUMNS.map(function(col) {
      var val = params[col];
      return (val !== undefined && val !== null) ? val : "";
    });

    sheet.appendRow(row);

    // Log for debugging (visible in Apps Script → Executions)
    Logger.log("Row added: participant=" + params["participant_id"] +
               " condition=" + params["condition"] +
               " accuracy=" + params["accuracy_percent"] + "%");

    return ContentService
      .createTextOutput(JSON.stringify({
        status: "success",
        participant_id: params["participant_id"],
        rows_total: sheet.getLastRow() - 1
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("ERROR: " + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: "error",
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ── doGet: health check — visit the URL in browser to confirm live ─
function doGet(e) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Responses") || ss.getActiveSheet();
  var count = Math.max(0, sheet.getLastRow() - 1);
  return ContentService
    .createTextOutput("RegioMart backend is live. Responses collected: " + count)
    .setMimeType(ContentService.MimeType.TEXT);
}
