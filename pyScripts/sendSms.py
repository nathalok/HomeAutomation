import atom
import gdata.calendar
import gdata.calendar.service
import time
import sys
 
TIME_FORMAT = '%Y-%m-%dT%H:%M:%S.000Z'
CALENDAR_URL = 'http://www.google.com/calendar/feeds/default/private/full'
 
class GoogleSms:
    def __init__(self, username, password):
        self.username = username
        self.password = password
 
        service = gdata.calendar.service.CalendarService()
        service.email = username
        service.password = password
        service.source = 'GoogleSms'
        service.ProgrammaticLogin()
 
        self.calendar_service = service
 
    def send(self, message):
        # Set time to one hour from now
        event_time = time.strftime(TIME_FORMAT, time.gmtime(time.time()+3600))
 
        event = gdata.calendar.CalendarEventEntry()
        event.title = atom.Title(text=message)
        event.content = atom.Content(text=message)
 
        # Send a reminder 60 minutes before the event.
        # Since the event is 60 minutes from now, we will receive the message
        # in a few seconds.
        reminder = gdata.calendar.Reminder(minutes=60)
        reminder.method = 'sms'
 
        when = gdata.calendar.When(event_time)
        when.reminder.append(reminder)
 
        event.when.append(when)
 
        try:
            # Add the entry to calendar
            cal_event = self.calendar_service.InsertEvent(event, CALENDAR_URL)
        except gdata.service.RequestError, request_exception:
            raise
 
if __name__ == '__main__':
    sms = GoogleSms('test@gmail.com', 'Password')
    sms.send('Hello ! Alert for you.!')
    #print "Done"
    #sys.stdout.flush()	
