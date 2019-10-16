@isTest
public class SessionControllerTest {
    @isTest
    static void testGetSessionId() {
        Boolean success = true;
        try {
            String sessionId = SessionController.getSessionId();
        } catch (Exception e) {
            success = false;
        } finally {
            System.assert(success);
        }
    }
}
