using Domain;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{
    public class ActivitiesController : BaseApiController
    {
        private readonly DataContext _context;
        public ActivitiesController(DataContext context)
        {
            _context = context;
        }

        // GET: api/activities
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities([FromQuery] string date, [FromQuery] string category, [FromQuery] string city)
        {
            var query = _context.MyProperty.AsQueryable();

            // Apply filters if query parameters are provided
            if (!string.IsNullOrEmpty(date))
            {
                var parsedDate = DateTime.Parse(date);
                query = query.Where(activity => activity.Date.Date == parsedDate.Date);
            }

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(activity => activity.Category == category);
            }

            if (!string.IsNullOrEmpty(city))
            {
                query = query.Where(activity => activity.City == city);
            }

            var activities = await query.ToListAsync();
            return Ok(activities);
        }

        // GET: api/activities/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid id)
        {
            var activity = await _context.MyProperty.FindAsync(id);
            if (activity == null) return NotFound();
            return activity;
        }

        // POST: api/activities
        [HttpPost]
        public async Task<ActionResult<Activity>> CreateActivity(Activity activity)
        {
            _context.MyProperty.Add(activity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetActivity), new { id = activity.Id }, activity);
        }

        // PUT: api/activities/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateActivity(Guid id, Activity updatedActivity)
        {
            if (id != updatedActivity.Id) return BadRequest("ID mismatch");

            var activity = await _context.MyProperty.FindAsync(id);
            if (activity == null) return NotFound();

            // Update activity properties
            activity.Title = updatedActivity.Title;
            activity.Date = updatedActivity.Date;
            activity.Description = updatedActivity.Description;
            activity.Category = updatedActivity.Category;
            activity.City = updatedActivity.City;
            activity.Venue = updatedActivity.Venue;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/activities/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity(Guid id)
        {
            var activity = await _context.MyProperty.FindAsync(id);
            if (activity == null) return NotFound();

            _context.MyProperty.Remove(activity);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
