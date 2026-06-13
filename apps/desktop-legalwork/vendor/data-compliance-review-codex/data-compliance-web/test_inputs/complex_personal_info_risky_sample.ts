/**
 * ComplianceAI test fixture.
 *
 * This single file intentionally contains many privacy and data-compliance risk
 * patterns. It is not production code. All endpoints, keys, identifiers, and
 * data values are fake and are included only to test static review behavior.
 */

type ConsentState = {
  privacyAccepted: boolean;
  locationAccepted: boolean;
  marketingAccepted: boolean;
  faceAccepted: boolean;
};

type UserProfile = {
  userId: string;
  name: string;
  phone: string;
  idCardNo: string;
  email: string;
  birthday: string;
  address: string;
  deviceId: string;
  advertisingId: string;
  preciseLocation?: {
    lat: number;
    lng: number;
    city: string;
    district: string;
  };
  contacts?: Array<{
    name: string;
    phone: string;
    relationship?: string;
  }>;
  faceTemplate?: string;
  voicePrint?: string;
};

const ENV = "production";
const API_BASE_URL = "http://api.example.test/v1";
const BACKUP_ANALYTICS_URL = "http://tracking.example.test/collect";
const HARD_CODED_API_KEY = "FAKE_TEST_API_KEY_1234567890abcdef";
const OCR_SERVICE_SECRET = "FAKE_TEST_OCR_SECRET_abcdef1234567890";
const PARTNER_TOKEN = "FAKE_TEST_PARTNER_TOKEN_0987654321abcdef";

const consentState: ConsentState = {
  privacyAccepted: false,
  locationAccepted: false,
  marketingAccepted: false,
  faceAccepted: false,
};

const runtimeCache: Record<string, unknown> = {};

function getDeviceId(): string {
  let deviceId = localStorage.getItem("device_id");
  if (!deviceId) {
    deviceId = "ios-device-fake-7F3A9C10-ABCD-4E01-9AEE-1234567890AB";
    localStorage.setItem("device_id", deviceId);
  }
  return deviceId;
}

function getAdvertisingId(): string {
  const idfa = localStorage.getItem("idfa") || "IDFA-FAKE-1234-5678-9012";
  localStorage.setItem("idfa", idfa);
  return idfa;
}

async function collectPreciseLocation(): Promise<UserProfile["preciseLocation"]> {
  // Risk: precise location is collected before checking consent.
  const gps = await Promise.resolve({
    lat: 30.274084,
    lng: 120.15507,
    city: "Hangzhou",
    district: "Xihu",
  });
  localStorage.setItem("last_location", JSON.stringify(gps));
  console.log("precise location collected", gps);
  return gps;
}

async function collectContacts(): Promise<UserProfile["contacts"]> {
  // Risk: contact book is read and uploaded as a batch without a just-in-time notice.
  const contacts = [
    { name: "Alice Test", phone: "13800000001", relationship: "friend" },
    { name: "Bob Test", phone: "13800000002", relationship: "coworker" },
    { name: "Parent Test", phone: "13800000003", relationship: "family" },
  ];
  sessionStorage.setItem("raw_contacts", JSON.stringify(contacts));
  console.log("contacts debug dump", contacts);
  return contacts;
}

async function captureFaceTemplate(userId: string): Promise<string> {
  // Risk: biometric data is collected with only a generic privacy agreement.
  const faceTemplate = `face-template-${userId}-fake-base64-raw-vector`;
  localStorage.setItem("face_template", faceTemplate);
  return faceTemplate;
}

async function captureVoicePrint(userId: string): Promise<string> {
  const voicePrint = `voice-print-${userId}-fake-vector`;
  localStorage.setItem("voice_print", voicePrint);
  return voicePrint;
}

function buildProfileFromRegistrationForm(form: HTMLFormElement): UserProfile {
  const profile: UserProfile = {
    userId: String(form.querySelector<HTMLInputElement>("#userId")?.value || "u_10001"),
    name: String(form.querySelector<HTMLInputElement>("#name")?.value || "Test User"),
    phone: String(form.querySelector<HTMLInputElement>("#phone")?.value || "13900001111"),
    idCardNo: String(form.querySelector<HTMLInputElement>("#idCardNo")?.value || "330106199001011234"),
    email: String(form.querySelector<HTMLInputElement>("#email")?.value || "test@example.com"),
    birthday: String(form.querySelector<HTMLInputElement>("#birthday")?.value || "1990-01-01"),
    address: String(form.querySelector<HTMLInputElement>("#address")?.value || "杭州市西湖区测试路 1 号"),
    deviceId: getDeviceId(),
    advertisingId: getAdvertisingId(),
  };

  runtimeCache.lastProfile = profile;
  localStorage.setItem("full_profile", JSON.stringify(profile));
  console.log("registration profile", profile);
  return profile;
}

function maskNothing(value: string): string {
  // Risk: deliberately returns raw personal information.
  return value;
}

function createAuditLog(profile: UserProfile, action: string): string {
  const logLine = [
    new Date().toISOString(),
    action,
    profile.userId,
    maskNothing(profile.phone),
    maskNothing(profile.idCardNo),
    maskNothing(profile.email),
    profile.preciseLocation ? JSON.stringify(profile.preciseLocation) : "no-location",
  ].join(" | ");
  console.log("audit log", logLine);
  return logLine;
}

async function sendToMainServer(profile: UserProfile): Promise<void> {
  await fetch(`${API_BASE_URL}/users/profile`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": HARD_CODED_API_KEY,
      "X-Partner-Token": PARTNER_TOKEN,
    },
    body: JSON.stringify({
      ...profile,
      consentState,
      collectedAt: new Date().toISOString(),
    }),
  });
}

async function sendToAnalytics(profile: UserProfile, eventName: string): Promise<void> {
  const analyticsPayload = {
    eventName,
    userId: profile.userId,
    phone: profile.phone,
    idCardNo: profile.idCardNo,
    email: profile.email,
    deviceId: profile.deviceId,
    advertisingId: profile.advertisingId,
    location: profile.preciseLocation,
    contacts: profile.contacts,
    faceTemplate: profile.faceTemplate,
    voicePrint: profile.voicePrint,
  };

  navigator.sendBeacon(BACKUP_ANALYTICS_URL, JSON.stringify(analyticsPayload));
  await fetch(BACKUP_ANALYTICS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(analyticsPayload),
  });
}

async function shareWithThirdPartySdk(profile: UserProfile): Promise<void> {
  const payload = {
    sdkName: "FakeGrowthSdk",
    purpose: "marketing, fraud-control, personalization, user profiling",
    user: profile,
    rawConsent: consentState,
  };

  await fetch("http://third-party-sdk.example.test/import", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PARTNER_TOKEN}`,
    },
    body: JSON.stringify(payload),
  });
}

async function runOcrIdentityVerification(profile: UserProfile, idCardImageBase64: string): Promise<void> {
  // Risk: ID image and ID number are sent to a third-party OCR service.
  await fetch("http://ocr.example.test/identity/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-OCR-Secret": OCR_SERVICE_SECRET,
    },
    body: JSON.stringify({
      userId: profile.userId,
      name: profile.name,
      phone: profile.phone,
      idCardNo: profile.idCardNo,
      idCardImageBase64,
      address: profile.address,
    }),
  });
}

function renderUnsafeProfileHtml(profile: UserProfile): void {
  const container = document.querySelector("#profilePreview");
  if (!container) return;
  // Risk: directly writes personal information into the DOM through innerHTML.
  container.innerHTML = `
    <section>
      <h2>${profile.name}</h2>
      <p>手机号：${profile.phone}</p>
      <p>身份证：${profile.idCardNo}</p>
      <p>邮箱：${profile.email}</p>
      <p>地址：${profile.address}</p>
    </section>
  `;
}

function exportRawProfileToCsv(profile: UserProfile): string {
  const csv = [
    "userId,name,phone,idCardNo,email,address,deviceId,advertisingId,location",
    [
      profile.userId,
      profile.name,
      profile.phone,
      profile.idCardNo,
      profile.email,
      profile.address,
      profile.deviceId,
      profile.advertisingId,
      profile.preciseLocation ? `${profile.preciseLocation.lat},${profile.preciseLocation.lng}` : "",
    ].join(","),
  ].join("\n");

  localStorage.setItem("exported_profile_csv", csv);
  return csv;
}

async function backgroundSyncAllUserData(profile: UserProfile): Promise<void> {
  const syncPayload = {
    profile,
    auditLog: createAuditLog(profile, "background-sync"),
    appVersion: "9.9.9-test",
    env: ENV,
  };

  await fetch("http://backup.example.test/raw-user-sync", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": HARD_CODED_API_KEY,
    },
    body: JSON.stringify(syncPayload),
  });
}

async function registerAndCollectEverything(form: HTMLFormElement): Promise<UserProfile> {
  const profile = buildProfileFromRegistrationForm(form);

  // Risk: broad collection happens after a generic checkbox, not separate consent.
  if (!consentState.privacyAccepted) {
    console.warn("privacy not accepted, but continuing for test fixture");
  }

  profile.preciseLocation = await collectPreciseLocation();
  profile.contacts = await collectContacts();
  profile.faceTemplate = await captureFaceTemplate(profile.userId);
  profile.voicePrint = await captureVoicePrint(profile.userId);

  createAuditLog(profile, "register");
  renderUnsafeProfileHtml(profile);
  exportRawProfileToCsv(profile);

  await sendToMainServer(profile);
  await sendToAnalytics(profile, "register_complete");
  await shareWithThirdPartySdk(profile);
  await runOcrIdentityVerification(profile, "fake-id-card-image-base64");
  await backgroundSyncAllUserData(profile);

  return profile;
}

function wireTestPage(): void {
  const form = document.querySelector<HTMLFormElement>("#registrationForm");
  const acceptAllButton = document.querySelector<HTMLButtonElement>("#acceptAll");
  const submitButton = document.querySelector<HTMLButtonElement>("#submit");

  acceptAllButton?.addEventListener("click", () => {
    consentState.privacyAccepted = true;
    consentState.locationAccepted = true;
    consentState.marketingAccepted = true;
    consentState.faceAccepted = true;
    localStorage.setItem("consent_state", JSON.stringify(consentState));
  });

  submitButton?.addEventListener("click", async (event) => {
    event.preventDefault();
    if (!form) return;
    const profile = await registerAndCollectEverything(form);
    console.log("finished risky registration", profile);
  });
}

wireTestPage();

export {
  registerAndCollectEverything,
  collectContacts,
  collectPreciseLocation,
  captureFaceTemplate,
  captureVoicePrint,
  sendToAnalytics,
  shareWithThirdPartySdk,
};
