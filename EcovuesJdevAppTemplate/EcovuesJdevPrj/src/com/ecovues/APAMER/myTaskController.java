package com.ecovues.imaging;


import com.ecovues.imaging.JdbcHelper;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;

import java.util.Iterator;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import oracle.jdbc.OracleTypes;

import oracle.sql.ARRAY;
import oracle.sql.ArrayDescriptor;
import oracle.sql.STRUCT;
import oracle.sql.StructDescriptor;

import org.json.JSONObject;
import org.json.simple.JSONArray;
import org.json.simple.parser.JSONParser;


import java.util.ArrayList;
import java.util.List;

import org.sql2o.tools.NamedParameterStatement;
@Path("myTasks")
public class myTaskController {
    
   // Connection ebsconn = JdbcHelper.getAppsJDBCConn(true);
    
    public myTaskController() {
        super();
    }
    @GET
    @Path("/m1")
    public String getName() {
        return "Rest service working fine";
    }
    
    @GET
       @Path("/configs")
       @Produces("application/json")
       public Response configs() throws Exception {
           Connection ebsconn = JdbcHelper.getJDBCConnectionFromDataSource(true);
           //System.out.println("Yes");
           JSONObject obj = new JSONObject();

           JSONObject jsonArray = new JSONObject();
           String query = "select * from ecoui_configs";


           NamedParameterStatement p = new NamedParameterStatement(ebsconn, query, true);

           ResultSet rs = null;

           try {
               rs = p.executeQuery();
               jsonArray = JdbcHelper.convertToJSON(rs);
               p.close();
               rs.close();
           } catch (SQLException e) {
               return Response.status(200).entity(e.toString()).header("Access-Control-Allow-Origin",
                                                                       "*").header("Access-Control-Allow-Methods",
                                                                                   "GET, POST, DELETE, PUT").build();
           } finally {
               //connMgr.closeJDBCConnection(conn);
               ebsconn.close();
           }


           return Response.status(200).entity(jsonArray.toString()).header("Access-Control-Allow-Origin",
                                                                           "*").header("Access-Control-Allow-Methods",
                                                                                       "GET, POST, DELETE, PUT").build();
       }
    @GET
           @Path("/mytaskstaging")
           @Produces("application/json")
           public Response mytaskstaging(       
                                           @DefaultValue("N") @QueryParam("debug") String debug , 
                                           @DefaultValue("N")@QueryParam("getquery") String getquery ) throws Exception {
               Connection ebsconn = JdbcHelper.getEcouiJDBCConn(true);
               //System.out.println("Yes");
               JSONObject obj = new JSONObject();

               JSONObject jsonArray = new JSONObject();
               String query = "select * from ecoui_mytask_header_stg";
               

               System.out.println("myTaskStaging: SQL Query: "+query);

                   
               if (getquery.equals("Y")) {
                                       return Response.status(200).entity("Query: \n"+query+"\n"+
                                                                          ", parameters: \n").header("Access-Control-Allow-Origin",
                                                                                       "*").header("Access-Control-Allow-Methods",
                                                                                                   "GET, POST, DELETE, PUT").build();
               } 
              
               NamedParameterStatement p =
                   new NamedParameterStatement(ebsconn, query, true);
               if(debug.equals("Y"))
               System.out.println("myTaskStaging: Connection Opened ");

               ResultSet rs = null;

               try {
                 


                   rs = p.executeQuery();


                   jsonArray = JdbcHelper.convertToJSON(rs);
                   p.close();
                   rs.close();
                   if(debug.equals("Y"))
                   System.out.println("myTaskStaging: Prepared Statement and Resultset Closed");
               } catch (SQLException e) {
                   if(debug.equals("Y"))
                   System.out.println("myTaskStaging: SQL Exception"+e.toString());
                   return Response.status(200).entity(e.toString()).header("Access-Control-Allow-Origin",
                                                                           "*").header("Access-Control-Allow-Methods",
                                                                                       "GET, POST, DELETE, PUT").build();
               } finally {
                   //connMgr.closeJDBCConnection(conn);
                   ebsconn.close();
            //ebsconn.close();
                   if(debug.equals("Y"))
                   System.out.println("myTaskStaging: Connection Closed");
               }


               return Response.status(200).entity(jsonArray.toString()).header("Access-Control-Allow-Origin",
                                                                               "*").header("Access-Control-Allow-Methods",
                                                                                           "GET, POST, DELETE, PUT").build();
           }
   
  
}
