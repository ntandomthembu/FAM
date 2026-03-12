export enum IncidentStatus {
    REPORTED = "reported",
    UNDER_INVESTIGATION = "under_investigation",
    CONFIRMED_OUTBREAK = "confirmed_outbreak",
    FALSE_ALARM = "false_alarm",
    RESOLVED = "resolved"
}

export enum AnimalSpecies {
    CATTLE = "cattle",
    SHEEP = "sheep",
    GOATS = "goats",
    PIGS = "pigs",
    BUFFALO = "buffalo",
    DEER = "deer",
    OTHER = "other"
}

export enum MovementPermitStatus {
    PENDING = "pending",
    APPROVED = "approved",
    DENIED = "denied",
    EXPIRED = "expired",
    REVOKED = "revoked"
}

export enum QuarantineZoneStatus {
    ACTIVE = "active",
    LIFTED = "lifted",
    EXPIRED = "expired"
}

export enum VaccinationCampaignStatus {
    PLANNED = "planned",
    SCHEDULED = "scheduled",
    IN_PROGRESS = "in_progress",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

export enum AlertType {
    OUTBREAK_SUSPECTED = "outbreak_suspected",
    OUTBREAK_CONFIRMED = "outbreak_confirmed",
    MOVEMENT_BAN = "movement_ban",
    QUARANTINE_DECLARED = "quarantine_declared",
    QUARANTINE_LIFTED = "quarantine_lifted",
    VACCINATION_CAMPAIGN = "vaccination_campaign",
    PROXIMITY_WARNING = "proximity_warning"
}

export enum AlertChannel {
    PUSH = "push",
    SMS = "sms",
    WHATSAPP = "whatsapp",
    EMAIL = "email"
}

export enum UserRole {
    FARMER = "farmer",
    VETERINARIAN = "veterinarian",
    AUTHORITY = "authority",
    REGULATOR = "regulator",
    VACCINE_DISTRIBUTOR = "vaccine_distributor",
    TRANSPORTER = "transporter",
    ADMIN = "admin"
}

export enum LabSampleResult {
    PENDING = "pending",
    POSITIVE = "positive",
    NEGATIVE = "negative",
    INCONCLUSIVE = "inconclusive"
}

export enum TransportStatus {
    PENDING = "pending",
    IN_TRANSIT = "in_transit",
    COMPLETED = "completed",
    CANCELLED = "cancelled"
}

export enum ExportCertificateStatus {
    PENDING = "pending",
    APPROVED = "approved",
    REVOKED = "revoked",
    EXPIRED = "expired",
    VALID = "valid"
}