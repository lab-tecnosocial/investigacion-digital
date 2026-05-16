/// <reference path="../../pb_data/types.d.ts" />

// Custom route that returns only the inscription count for a given course.
// This allows the frontend to show a live counter without exposing personal data.
//
// Usage: GET /api/custom/count?slug=mapas-qgis
// Response: { "count": 12 }
//
// The List rule on "inscripciones" stays LOCKED (Superusers only).
// This route has direct DB access — no API rule applies to it.

routerAdd("GET", "/api/custom/count", (e) => {
    const slug = e.request.url.query().get("slug")

    if (!slug) {
        return e.json(400, { "error": "Missing slug parameter" })
    }

    const result = e.app.db()
        .newQuery("SELECT COUNT(*) as total FROM inscripciones WHERE curso_slug={:slug}")
        .bind({ slug: slug })
        .one()

    return e.json(200, { "count": result?.total ?? 0 })
})
