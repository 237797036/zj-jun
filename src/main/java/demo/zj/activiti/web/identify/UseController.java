package demo.zj.activiti.web.identify;

import org.activiti.engine.IdentityService;
import org.activiti.engine.identity.Group;
import org.activiti.engine.identity.User;
import org.apache.commons.lang3.ArrayUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import demo.zj.activiti.entity.Ret;
import demo.zj.activiti.util.UserUtil;

import javax.servlet.http.HttpSession;

import java.util.List;

/**
 * 用户相关控制器
 *
 * @author zj
 */
@Controller
@RequestMapping("/user")
public class UseController {

    private static Logger logger = LoggerFactory.getLogger(UseController.class);

    // Activiti Identify Service
    @Autowired
    private IdentityService identityService;

    /**
     * 登录系统
     *
     * @param userName
     * @param password
     * @param session
     * @return
     */
    @RequestMapping(value = "/logon")
    @ResponseBody
    public Ret logon(@RequestParam("username") String userName, @RequestParam("password") String password, HttpSession session) {
    	Ret ret = new Ret();
        logger.debug("logon request: {username={}, password={}}", userName, password);
        boolean checkPassword = identityService.checkPassword(userName, password);
        if (checkPassword) {

            // read user from database
            User user = identityService.createUserQuery().userId(userName).singleResult();
            UserUtil.saveUserToSession(session, user);

            List<Group> groupList = identityService.createGroupQuery().groupMember(userName).list();
            session.setAttribute("groups", groupList);

            String[] groupNames = new String[groupList.size()];
            for (int i = 0; i < groupNames.length; i++) {
                System.out.println(groupList.get(i).getName());
                groupNames[i] = groupList.get(i).getName();
            }

            session.setAttribute("groupNames", ArrayUtils.toString(groupNames));

            return ret;
        } else {
        	ret.setCode("9999");
        	ret.setMessage("登录失败！");
            return ret;
        }
    }

    @RequestMapping(value = "/logout")
    @ResponseBody
    public Ret logout(HttpSession session) {
    	Ret ret = new Ret();
        session.removeAttribute("user");
        return ret;
    }

    /*@Autowired
    public void setIdentityService(IdentityService identityService) {
        this.identityService = identityService;
    }*/

}
