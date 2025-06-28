import axios from 'axios';
import { openDB } from 'idb';

// Database and store names
const DB_NAME = "schoolDB";
const STORE_NAME = "apiCache";
const PENDING_ATTENDANCE_STORE = "pendingPosts";
const ENROLLMENT_STORE = "pendingEnrollments";
const DB_VERSION = 4; // Increment the version to apply changes
const STUDENT_STORE = "studentDetails";
const STUDENTS_STORE = "cachedStudents";
const STUDENTLIST_STORE = 'studentsList'
const RESULTS_STORE = "resultsStore";
const RESULTS_SUBMISSION_STORE = "offline_results_submissions";
const PENDING_RESULTS_STORE = "pendingResultsSubmissions";


// Initialize IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion, newVersion, transaction) {
      alert(`⚙️ Upgrading IndexedDB from v${oldVersion} to v${newVersion}`);
      console.log(`⚙️ Upgrading IndexedDB from v${oldVersion} to v${newVersion}`);
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
      if (!db.objectStoreNames.contains(PENDING_ATTENDANCE_STORE)) {
        db.createObjectStore(PENDING_ATTENDANCE_STORE, { autoIncrement: true });
      }
      if (!db.objectStoreNames.contains(ENROLLMENT_STORE)) {
        db.createObjectStore(ENROLLMENT_STORE, { autoIncrement: true });
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains(STUDENT_STORE)) {
          db.createObjectStore(STUDENT_STORE, { keyPath: "id" });
        }
      }
      if (!db.objectStoreNames.contains(STUDENTS_STORE)) {
        db.createObjectStore(STUDENTS_STORE, { keyPath: "id" });
        console.log("✅ Created 'cachedStudents' store.");
      }
      if (!db.objectStoreNames.contains(STUDENTLIST_STORE)) {
        db.createObjectStore(STUDENTLIST_STORE);
      }
      if (!db.objectStoreNames.contains(RESULTS_STORE)) {
        db.createObjectStore(RESULTS_STORE); // No keyPath, so you'll always provide key manually
      }
      if (!db.objectStoreNames.contains(RESULTS_SUBMISSION_STORE)) {
        db.createObjectStore(RESULTS_SUBMISSION_STORE, { keyPath: "timestamp" });
      }
      if (!db.objectStoreNames.contains(PENDING_RESULTS_STORE)) {
        db.createObjectStore(PENDING_RESULTS_STORE, {
          autoIncrement: true,
        });
        console.log("✅ Created 'pendingResultsSubmissions' store.");
      }
    },
  });
};



// Save API response to cache
export const saveDataToCache = async (key: string, data: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, data, key);
};

// Get cached data
export const getCachedData = async (key: string) => {
  const db = await initDB();
  return await db.get(STORE_NAME, key);
};

// Save pending delete request to IndexedDB
export const savePendingDelete = async (id: number) => {
  const db = await initDB();
  await db.put(STORE_NAME, { id, url: `https://api.example.com/classes/${id}` });
};

// Ask user for confirmation before retrying DELETE
export const processPendingDeletes = async () => {
  const db = await initDB();
  const allDeletes = await db.getAll(STORE_NAME);

  for (const item of allDeletes) {
    const confirmDelete = window.confirm(
      `You were offline earlier. Do you still want to delete class ID ${item.id}?`
    );

    if (confirmDelete) {
      try { 
        await axios.delete(item.url);
        await db.delete(STORE_NAME, item.id);
        console.log(`Successfully deleted class ID ${item.id} from server`);
      } catch (error) {
        console.error(`Failed to delete class ID ${item.id}. Will retry later.`);
      }
    } else {
      console.log(`User canceled delete request for class ID ${item.id}`);
    }
  }
};

// Save authentication details to IndexedDB
export const saveAuthToCache = async (authData: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, authData, "auth"); // Save under the key "auth"
};

// Get cached authentication data
export const getCachedAuth = async () => {
  const db = await initDB();
  return await db.get(STORE_NAME, "auth");
};

// Remove cached authentication data (for logout)
export const removeCachedAuth = async () => {
  const db = await initDB();
  await db.delete(STORE_NAME, "auth");
};


// Call `processPendingDeletes` when the internet is restored
// window.addEventListener("online", processPendingDeletes);

// Save parents list to cache
export const saveParentsToCache = async (data: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, data, "parents");
};

// Get cached parents data
export const getCachedParents = async () => {
  const db = await initDB();
  return await db.get(STORE_NAME, "parents");
};

// Save tags list to cache
export const saveTagsToCache = async (data: any) => {
  const db = await initDB();
  await db.put(STORE_NAME, data, "tags");
};

// Get cached tags data
export const getCachedTags = async () => {
  const db = await initDB();
  return await db.get(STORE_NAME, "tags");
};

// Save pending student enrollment request to cache
export const savePendingEnrollment = async (formData: FormData) => {
  const db = await initDB();
  const key = `enrollment_${new Date().getTime()}`; // Unique key
  await db.put(STORE_NAME, formData, key);
  console.log("Saved pending enrollment:", key);
};

// Get all pending enrollments
export const getPendingEnrollments = async () => {
  const db = await initDB();
  return await db.getAllKeys(STORE_NAME);
};

// Remove successfully sent enrollment request
export const removePendingEnrollment = async (key: string) => {
  const db = await initDB();
  await db.delete(STORE_NAME, key);
};

// Process pending enrollments when back online
export const processPendingEnrollments = async () => {
  const db = await initDB();
  const keys = await db.getAllKeys(STORE_NAME);

  for (const key of keys) {
    // Ensure the key is treated as a string
    if (typeof key === "string" && key.startsWith("enrollment_")) {
      const formData = await db.get(STORE_NAME, key);

      try {
        const response = await axios.post(
          "https://server.schsms.xyz/api/enroll-student/",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Resubmitted enrollment successfully:", response.data);
        alert("Pending enrollment successfully submitted!");
        await removePendingEnrollment(key); // Remove from cache
      } catch (error) {
        console.error("Failed to resubmit enrollment:", error);
      }
    }
  }
};





// Listen for online event to retry submissions
window.addEventListener("online", processPendingEnrollments);

// Save pending form submission
export const savePendingGuardianSubmission = async (data: any) => {
  const db = await initDB();
  const pendingRequests = (await db.get(STORE_NAME, "pending_guardians")) || [];
  pendingRequests.push(data);
  await db.put(STORE_NAME, pendingRequests, "pending_guardians");
};

// Get pending submissions
export const getPendingGuardianSubmissions = async () => {
  const db = await initDB();
  return (await db.get(STORE_NAME, "pending_guardians")) || [];
};

// Clear processed submissions
export const clearPendingGuardianSubmissions = async () => {
  const db = await initDB();
  await db.delete(STORE_NAME, "pending_guardians");
};


// Process pending submissions when online
export const processPendingGuardianSubmissions = async () => {
  const pendingSubmissions = await getPendingGuardianSubmissions();
  if (pendingSubmissions.length === 0) return;

  alert("Internet restored, syncing data!");

  for (const submission of pendingSubmissions) {
    try {
      await axios.post(
        "https://server.schsms.xyz/api/api/guardians-multiple/",
        submission
      );
      console.log("Pending submission uploaded:", submission);
    } catch (error) {
      console.error("Failed to upload pending submission:", error);
    }
  }

  // Clear pending submissions after successful processing
  await clearPendingGuardianSubmissions();

  alert("Successfully synced all pending data!");
};

// Automatically process pending submissions when online
window.addEventListener("online", processPendingGuardianSubmissions);


// Attendance related stuffs here
// ✅ Save attendance data when offline
export const savePendingAttendance = async (className: string, data: any) => {
  const db = await initDB();
  await db.add(PENDING_ATTENDANCE_STORE, { className, data });
  alert(`📌 No internet! Attendance for ${className} saved locally.`);
  console.log(`Saved attendance for ${className} offline.`);
};

// ✅ Sync pending attendance submissions when online
export const syncPendingAttendance = async () => {
  const db = await initDB();
  const pendingAttendance = await db.getAll(PENDING_ATTENDANCE_STORE);

  if (pendingAttendance.length === 0) return;

  // Show confirmation modal before syncing
  const confirmSync = window.confirm(
    `⚡ You have ${pendingAttendance.length} pending attendance records. Sync now?`
  );

  if (!confirmSync) {
    console.log("User chose NOT to sync attendance.");
    return;
  }

  for (const record of pendingAttendance) {
    try {
      const url = `https://server.schsms.xyz/api/attendance/${record.className}/mark/`;
      await axios.post(url, record.data);
      await db.delete(PENDING_ATTENDANCE_STORE, record.id);
      alert(`✅ Attendance for ${record.className} synced successfully!`);
      console.log(`Synced attendance for ${record.className}`);
    } catch (error) {
      alert(`❌ Sync failed for ${record.className}. Will retry later.`);
      console.error(`Failed to sync attendance for ${record.className}`, error);
    }
  }
};

// ✅ Automatically check for pending attendance when online
window.addEventListener("online", syncPendingAttendance);


// Student enrollment
// ✅ Save enrollment data when offline
export const savePendingStudentEnrollment = async (formData: FormData) => {
  const db = await initDB();

  // Convert FormData to JSON
  const jsonObject: Record<string, any> = {};
  formData.forEach((value, key) => {
    if (!jsonObject[key]) {
      jsonObject[key] = value;
    } else if (Array.isArray(jsonObject[key])) {
      jsonObject[key].push(value);
    } else {
      jsonObject[key] = [jsonObject[key], value];
    }
  });

  // Save and retrieve ID
  const id = await db.add(ENROLLMENT_STORE, jsonObject);
  jsonObject.id = id; // Assign the auto-generated ID

  alert("📌 No internet! Enrollment data saved locally.");
  console.log("Enrollment data stored offline:", jsonObject);
  window.location.href = "/people/students"
};



// ✅ Sync pending enrollments when online
export const syncPendingEnrollments = async () => {
  const db = await initDB();
  const pendingEnrollments = await db.getAllKeys(ENROLLMENT_STORE); // Get all keys
  const enrollments = await db.getAll(ENROLLMENT_STORE); // Get all enrollments

  if (pendingEnrollments.length === 0) return;

  const confirmSync = window.confirm(
    `⚡ You have ${pendingEnrollments.length} pending enrollments. Sync now?`
  );

  if (!confirmSync) {
    console.log("User chose NOT to sync enrollments.");
    return;
  }

  for (let i = 0; i < enrollments.length; i++) {
    const enrollment = enrollments[i];
    const enrollmentId = pendingEnrollments[i]; // Get corresponding ID

    try {
      const url = "https://server.schsms.xyz/api/enroll-student/";

      // Convert JSON back to FormData
      const formData = new FormData();
      Object.keys(enrollment).forEach((key) => {
        if (Array.isArray(enrollment[key])) {
          enrollment[key].forEach((value: string) => formData.append(key, value));
        } else {
          formData.append(key, enrollment[key]);
        }
      });

      await axios.post(url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await db.delete(ENROLLMENT_STORE, enrollmentId); // Use correct IndexedDB key
      alert(`✅ Enrollment ${i + 1} synced successfully!`);
      console.log(`Synced enrollment`, enrollment);
    } catch (error) {
      alert(`❌ Sync failed for enrollment ${i + 1}. Will retry later.`);
      console.error(`Failed to sync enrollment`, error);
    }
  }
};



// ✅ Automatically check for pending enrollments when online
window.addEventListener("online", async () => {
  console.log("🌐 Internet restored! Checking for pending enrollments...");
  alert("🌐 Internet restored! Syncing pending enrollments...");
  await syncPendingEnrollments();
});

// Students Detail page
// ✅ Save student details when fetched
export const saveStudentDetail = async (studentData: any) => {
  const db = await initDB();
  await db.put(STUDENT_STORE, studentData);
  console.log(`📌 Cached student: ${studentData.full_name}`);
};

// ✅ Fetch student details from IndexedDB
export const getCachedStudentDetail = async (id: number) => {
  const db = await initDB();
  return await db.get(STUDENT_STORE, id);
};


// View fetched students 

export const saveStudentsToCache = async (students: any[]) => {
  const db = await initDB();
  const tx = db.transaction(STUDENT_STORE, "readwrite");
  const store = tx.objectStore(STUDENT_STORE);

  // Clear old data before saving new
  await store.clear();

  students.forEach((student) => {
    store.put(student);
  });

  await tx.done;
  console.log("✅ Students cached successfully.");
};

// ✅ Load students from cache if offline
export const loadStudentsFromCache = async () => {
  const db = await initDB();
  return db.getAll(STUDENT_STORE);
};


// for the view students endpoint
// Save student list
export const saveStudentsListToCache = async (key: string, data: any) => {
  const db = await initDB();
  await db.put(STUDENTLIST_STORE, data, key);
};

// Get cached student list
export const getStudentsListFromCache = async (key: string) => {
  const db = await initDB();
  return await db.get(STUDENTLIST_STORE, key);
};

// Clear cache if needed
export const clearStudentsListCache = async () => {
  const db = await initDB();
  const tx = db.transaction(STUDENTLIST_STORE, 'readwrite');
  tx.store.clear();
  await tx.done;
};

// Save pending result submissions
export const savePendingResultsSubmission = async (submission: any) => {
  const db = await initDB();
  const tx = db.transaction(PENDING_RESULTS_STORE, "readwrite");
  const store = tx.objectStore(PENDING_RESULTS_STORE);
  await store.add(submission); // ✅ No need to provide key manually with autoIncrement
  await tx.done;
};

// Retrieve all pending result submissions
export const getAllPendingResultSubmissions = async () => {
  const db = await initDB();
  const tx = db.transaction(PENDING_RESULTS_STORE, "readonly");
  const store = tx.objectStore(PENDING_RESULTS_STORE);
  const allSubmissions = await store.getAll();
  await tx.done;
  return allSubmissions;
};

// Delete a specific pending result submission
export const deletePendingResultsSubmission = async (id: number) => {
  const db = await initDB();
  await db.delete(PENDING_RESULTS_STORE, id);
};



const processPendingResultsSubmissions = async () => {
  const pendingSubmissions = await getAllPendingResultSubmissions();

  if (pendingSubmissions.length === 0) return;

  const userConfirmed = window.confirm(
    `You have ${pendingSubmissions.length} pending result submissions. Do you want to sync them now?`
  );

  if (!userConfirmed) return;

  for (const [index, submission] of pendingSubmissions.entries()) {
    try {
      await axios.post(
        `https://server.schsms.xyz/api/results/${submission.studentClassName}/`,
        submission.payload
      );
      await deletePendingResultsSubmission(index);
      alert(`✅ Synced results for class ${submission.studentClassName}`);
    } catch (error) {
      console.error(`❌ Failed to sync results for class ${submission.studentClassName}`, error);
      alert(`❌ Failed to sync results for class ${submission.studentClassName}`);
    }
  }
};

// Save results to the RESULTS_STORE with a unique key
export const saveResultsToCache = async (key: string, data: any) => {
  const db = await initDB();
  const tx = db.transaction(RESULTS_STORE, 'readwrite');
  const store = tx.objectStore(RESULTS_STORE);
  await store.put({ timestamp: Date.now(), data }, key); // ✅ Provide the key explicitly
  await tx.done;
};



// Get cached results from RESULTS_STORE
export const getResultsFromCache = async (key: string, maxAge = 432000000) => {
  const db = await initDB();
  const tx = db.transaction(RESULTS_STORE, 'readonly');
  const store = tx.objectStore(RESULTS_STORE);
  const record = await store.get(key);
  await tx.done;

  if (!record) return null;

  const isStale = Date.now() - record.timestamp > maxAge;
  return isStale ? null : record.data;
};



// Optional: clear results cache
export const clearAllCachedResults = async () => {
  const db = await initDB();
  await db.clear(RESULTS_STORE);
};


// Listen for online status and attempt to sync pending submissions
window.addEventListener("online", processPendingResultsSubmissions);
