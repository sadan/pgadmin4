import os
import json
import uuid


CURRENT_PATH = os.path.dirname(os.path.realpath(__file__))
with open(CURRENT_PATH + "/debugger_test_data.json") as data_file:
    test_cases = json.load(data_file)


def delete_function(self, utils):
    response = self.tester.delete(
        '/browser/function/obj/' + str(utils.SERVER_GROUP) + '/' +
        str(self.server_id) + '/' +
        str(self.db_id) + '/' +
        str(self.schema_id) + '/' + str(self.func_id),
        content_type='html/json'
    )

    self.assertEqual(response.status_code, 200)


def create_function(self, utils):
    self.test_data['pronamespace'] = self.schema_id
    self.test_data['name'] = self.test_data['name'] + str(uuid.uuid4())[1:8]

    function_url = 'browser/function/obj/{0}/{1}/{2}/{3}/'.format(
        str(utils.SERVER_GROUP), str(self.server_id), str(self.db_id),
        str(self.schema_id))

    response = self.tester.post(
        function_url,
        data=json.dumps(self.test_data),
        content_type='html/json'
    )
    return response


def close_debugger(self):
    response = self.tester.delete(
        'debugger/close/' + str(self.trans_id),
        content_type='application/json')

    self.assertEqual(response.status_code, 200)


def abort_debugger(self):
    response = self.tester.get(
        'debugger/execute_query/' + str(self.trans_id) + '/abort_target',
        content_type='application/json')

    self.assertEqual(response.status_code, 200)


def add_extension(self, utils):
    extension_url = '/browser/extension/obj/{0}/{1}/{2}/'.format(
        str(utils.SERVER_GROUP), str(self.server_id), str(self.db_id))
    extension_data = {
        "name": "pldbgapi",
        "relocatable": True,
        "schema": self.schema_name,
        "version": "1.1"
    }
    try:
        connection = utils.get_db_connection(self.db_name,
                                             self.server['username'],
                                             self.server['db_password'],
                                             self.server['host'],
                                             self.server['port'],
                                             self.server['sslmode'])
        pg_cursor = connection.cursor()
        # Create pldbgapi extension if not exist.
        pg_cursor.execute('''CREATE EXTENSION IF NOT EXISTS
        "%s" WITH SCHEMA "%s" VERSION
        "%s" ''' % ('pldbgapi', self.schema_name, '1.1')
        )

        connection.commit()
    except Exception as e:
        print('Unable to create "pldbgapi" extension.')


def init_debugger_function(self):
    function_url = '/debugger/init/function/'
    response = self.tester.get(
        function_url + str(self.server_id) + '/' + str(self.db_id) +
        '/' + str(self.schema_id) + '/' + str(self.func_id),
        content_type='application/json')

    self.assertEqual(response.status_code, 200)
    return response


def initialize_target(self, utils, close_debugger_instance=True):
    target_url = '/debugger/initialize_target/{0}/'.format(self.type)
    response = self.tester.get(
        target_url + str(self.trans_id) + '/' + str(self.server_id) +
        '/' + str(self.db_id) + '/' + str(self.schema_id) +
        '/' + str(self.func_id),
        content_type='application/json')

    if response.status_code == 200:
        return response
    else:
        if close_debugger_instance:
            close_debugger(self)

        delete_function(self, utils)
        self.skipTest('The debugger plugin is not enabled. Please add the '
                      'plugin to the shared_preload_libraries setting in the '
                      'postgresql.conf file and restart the database server '
                      'for indirect debugging.')


def start_listener(self):
    response = self.tester.get(
        'debugger/start_listener/' + str(self.trans_id),
        content_type='application/json')

    self.assertEqual(response.status_code, 200)


def create_trigger(self, utils):
    response = self.tester.post(
        "{0}{1}/{2}/{3}/{4}/{5}/".format('/browser/trigger/obj/',
                                         utils.SERVER_GROUP,
                                         self.server_id, self.db_id,
                                         self.schema_id, self.table_id),
        data=json.dumps(self.test_data),
        content_type='html/json'
    )

    self.assertEqual(response.status_code, 200)
    return json.loads(response.data)['node']['_id']


def messages(self):
    response = self.tester.get(
        'debugger/messages/' + str(self.trans_id) + '/',
        content_type='application/json')

    return json.loads(response.data)['data']['result']


def start_execution(self):
    response = self.tester.get(
        'debugger/start_execution/' + str(self.trans_id) + '/' + str(
            self.port_no), content_type='application/json')

    self.assertEqual(response.status_code, 200)


def set_breakpoint(self):
    response = self.tester.get(
        "debugger/set_breakpoint/" + str(self.trans_id) + '/3/1',
        content_type='application/json')

    self.assertEqual(response.status_code, 200)
    return response
