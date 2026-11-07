/* What website measurement is actually switched on, as verified by a person.

   The Privacy page reads these flags so it never describes measurement that is
   not running (docs/phase-3-owner-actions.md says when to flip each one).
   Flip a flag only after checking the thing it names:

   webAnalytics    Cloudflare Web Analytics is enabled for the Pages project and
                   the beacon is present in the live HTML.
   eventStorage    `GET https://getpaddock.com/api/e` answers storage "configured"
                   (the PADDOCK_EVENTS binding exists) and a test event appears in
                   the report.
   appRecordsSource The app stores the sign-up label (`src`/`ch`) when an account
                   is created. This is true only after the wealthapp pull request
                   with the attribution change is merged and deployed.

   Defaults are false so that an unchecked change errs towards saying less. */

export const MEASUREMENT_STATUS = Object.freeze({
  webAnalytics: false,
  eventStorage: false,
  appRecordsSource: false,
  lastVerified: null, // ISO date a person last checked all three, or null
})
