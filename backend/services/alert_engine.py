class AlertEngine:
    def check(self, minute: int, state: str, wait_time: float, 
              demand_ratio: float, pending: int) -> list:
        alerts = []

        # Too many requests vs drivers
        if demand_ratio > 2.0:
            alerts.append({
                "minute": minute,
                "type": "DRIVER_SHORTAGE_WARNING",
                "message": f"Demand is {demand_ratio:.1f}x driver capacity! Send bonuses to drivers.",
                "severity": "HIGH"
            })

        # Wait time too long
        if wait_time > 10:
            alerts.append({
                "minute": minute,
                "type": "LONG_WAIT_ALERT",
                "message": f"Passengers waiting {wait_time:.1f} mins. Redirect nearby drivers.",
                "severity": "MEDIUM"
            })

        # Surge state
        if state == "S3_Surge":
            alerts.append({
                "minute": minute,
                "type": "SURGE_ACTIVE",
                "message": "Surge pricing is now active. Consider gradual increase.",
                "severity": "MEDIUM"
            })

        # Mass cancellations happening
        if state == "S5_Cancellations":
            alerts.append({
                "minute": minute,
                "type": "MASS_CANCELLATIONS",
                "message": "CRITICAL: Many passengers cancelling. System near collapse!",
                "severity": "CRITICAL"
            })

        return alerts